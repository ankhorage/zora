'use client';
import cytoscape, {
  type Core,
  type ElementDefinition,
  type EventObject,
  type Layouts,
  type StylesheetJson,
} from 'cytoscape';
import elk from 'cytoscape-elk';
import React from 'react';

cytoscape.use(elk as cytoscape.Ext);

export type GraphViewLayoutName = 'breadthfirst' | 'circle' | 'concentric' | 'elk' | 'grid';
export type GraphViewElementEventType =
  | 'press'
  | 'double-press'
  | 'select'
  | 'unselect'
  | 'pointer-enter'
  | 'pointer-leave';

export interface GraphViewNode {
  readonly id: string;
  readonly label?: string;
  readonly parentId?: string;
  readonly classes?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface GraphViewEdge {
  readonly id?: string;
  readonly source: string;
  readonly target: string;
  readonly classes?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface GraphViewStyleRule {
  readonly selector: string;
  readonly style: Readonly<Record<string, unknown>>;
}

export interface GraphViewElementEvent {
  readonly id: string;
  readonly type: GraphViewElementEventType;
}

export interface GraphViewViewport {
  readonly zoom: number;
  readonly pan: GraphViewPoint;
}

export interface GraphViewPoint {
  readonly x: number;
  readonly y: number;
}

export interface GraphViewController {
  fit(padding?: number): void;
  getViewport(): GraphViewViewport;
  setPan(pan: GraphViewPoint): void;
  setZoom(zoom: number): void;
}

export interface GraphViewProps {
  readonly nodes: readonly GraphViewNode[];
  readonly edges: readonly GraphViewEdge[];
  readonly layout?: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  readonly spacingFactor?: number;
  readonly styleRules?: readonly GraphViewStyleRule[];
  readonly selectedNodeIds?: readonly string[];
  readonly fitPadding?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly ariaLabel?: string;
  readonly onReady?: (controller: GraphViewController) => void;
  readonly onLayoutComplete?: (controller: GraphViewController) => void;
  readonly onNodeEvent?: (event: GraphViewElementEvent) => void;
  readonly onEdgeEvent?: (event: GraphViewElementEvent) => void;
  readonly onViewportChange?: (viewport: GraphViewViewport) => void;
}

/*** Render a browser graph while owning Cytoscape creation, layout, fit, resize, and disposal. */
export function GraphView(props: GraphViewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<GraphViewRuntime | null>(null);
  const callbacksRef = React.useRef(toCallbacks(props));
  callbacksRef.current = toCallbacks(props);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const runtime = createRuntime(container, props, callbacksRef);
    runtimeRef.current = runtime;
    return () => {
      runtime.destroy();
      runtimeRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime === null) return;
    runtime.update(props);
  }, [
    props.edges,
    props.fitPadding,
    props.layout,
    props.layoutOptions,
    props.maxZoom,
    props.minZoom,
    props.nodes,
    props.selectedNodeIds,
    props.spacingFactor,
    props.styleRules,
  ]);

  return (
    <div
      ref={containerRef}
      aria-label={props.ariaLabel ?? 'Graph'}
      className={props.className}
      role="application"
      style={{ height: '100%', minHeight: 0, minWidth: 0, width: '100%', ...props.style }}
    />
  );
}

interface GraphViewCallbacks {
  readonly onReady?: GraphViewProps['onReady'];
  readonly onLayoutComplete?: GraphViewProps['onLayoutComplete'];
  readonly onNodeEvent?: GraphViewProps['onNodeEvent'];
  readonly onEdgeEvent?: GraphViewProps['onEdgeEvent'];
  readonly onViewportChange?: GraphViewProps['onViewportChange'];
}

interface GraphViewRuntime {
  destroy(): void;
  update(props: GraphViewProps): void;
}

interface RuntimeState {
  readonly cy: Core;
  readonly controller: GraphViewController;
  readonly callbacksRef: { current: GraphViewCallbacks };
  readonly layoutRef: { current: Layouts | null };
  readonly layoutGenerationRef: { current: number };
  readonly layoutRunningRef: { current: boolean };
  readonly readyRef: { current: boolean };
  readonly resizeObserver: ResizeObserver;
  readonly fitPaddingRef: { current: number };
}

/*** Create one Cytoscape runtime and bind lifecycle-safe browser observers and events. */
function createRuntime(
  container: HTMLDivElement,
  props: GraphViewProps,
  callbacksRef: { current: GraphViewCallbacks }
): GraphViewRuntime {
  const cy = cytoscape({
    container,
    elements: [],
    minZoom: props.minZoom ?? 0.05,
    maxZoom: props.maxZoom ?? 2,
    selectionType: 'additive',
    userPanningEnabled: true,
  });
  const state = createRuntimeState(cy, props.fitPadding ?? 50, callbacksRef);
  bindGraphEvents(state);
  state.resizeObserver.observe(container);

  return {
    destroy() {
      destroyRuntime(state);
    },
    update(nextProps) {
      updateRuntime(state, nextProps);
    },
  };
}

/*** Create mutable runtime refs without exposing Cytoscape through the public component contract. */
function createRuntimeState(
  cy: Core,
  fitPadding: number,
  callbacksRef: { current: GraphViewCallbacks }
): RuntimeState {
  const layoutRef = { current: null as Layouts | null };
  const layoutGenerationRef = { current: 0 };
  const layoutRunningRef = { current: false };
  const readyRef = { current: false };
  const fitPaddingRef = { current: fitPadding };
  const controller = createController(cy, fitPaddingRef);
  const resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      if (cy.destroyed() || layoutRunningRef.current) return;
      cy.resize();
      fitNodes(cy, fitPaddingRef.current);
    });
  });

  return {
    cy,
    controller,
    callbacksRef,
    layoutRef,
    layoutGenerationRef,
    layoutRunningRef,
    readyRef,
    resizeObserver,
    fitPaddingRef,
  };
}

/*** Synchronize graph data and run a new layout generation from a settled initial viewport. */
function updateRuntime(state: RuntimeState, props: GraphViewProps) {
  if (state.cy.destroyed()) return;
  state.fitPaddingRef.current = props.fitPadding ?? 50;
  state.cy.minZoom(props.minZoom ?? 0.05);
  state.cy.maxZoom(props.maxZoom ?? 2);
  syncElements(state.cy, props);
  applyStyles(state.cy, props.styleRules);
  applySelectedNodes(state.cy, props.selectedNodeIds);
  runLayout(state, props);
}

/*** Run one layout generation with fitting disabled until the terminal layout-stop callback. */
function runLayout(state: RuntimeState, props: GraphViewProps) {
  stopLayout(state);
  const generation = state.layoutGenerationRef.current + 1;
  state.layoutGenerationRef.current = generation;
  state.layoutRunningRef.current = true;
  state.cy.resize();

  const layout = state.cy.layout({
    ...(props.layoutOptions ?? {}),
    name: props.layout ?? 'concentric',
    spacingFactor: props.spacingFactor ?? 1,
    nodeDimensionsIncludeLabels: true,
    fit: false,
    animate: false,
  });
  state.layoutRef.current = layout;
  state.cy.one('layoutstop', () => completeLayout(state, generation));
  layout.run();
}

/*** Complete only the latest layout generation and fit from node bounds after the browser settles. */
function completeLayout(state: RuntimeState, generation: number) {
  if (generation !== state.layoutGenerationRef.current || state.cy.destroyed()) return;
  state.layoutRef.current = null;

  requestAnimationFrame(() => {
    if (generation !== state.layoutGenerationRef.current || state.cy.destroyed()) return;
    state.cy.resize();
    fitNodes(state.cy, state.fitPaddingRef.current);
    state.layoutRunningRef.current = false;
    if (!state.readyRef.current) {
      state.readyRef.current = true;
      state.callbacksRef.current.onReady?.(state.controller);
    }
    state.callbacksRef.current.onLayoutComplete?.(state.controller);
  });
}

/*** Replace rendered elements while preserving source data and suppressing impossible compound edges. */
function syncElements(cy: Core, props: GraphViewProps) {
  const selectedIds =
    props.selectedNodeIds ?? cy.nodes(':selected').map((node) => String(node.id()));
  const elements = createRenderableElements(props.nodes, props.edges);

  cy.batch(() => {
    cy.elements().remove();
    cy.add(elements);
  });
  applySelectedNodes(cy, selectedIds);
}

/*** Convert plain graph data into Cytoscape elements and omit ancestor/descendant compound edges. */
function createRenderableElements(
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[]
): ElementDefinition[] {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const parentById = new Map(
    nodes.flatMap((node) => (node.parentId ? [[node.id, node.parentId] as const] : []))
  );
  const nodeElements: ElementDefinition[] = nodes.map((node) => ({
    group: 'nodes',
    classes: node.classes,
    data: {
      ...(node.data ?? {}),
      id: node.id,
      label: node.label ?? node.id,
      ...(node.parentId ? { parent: node.parentId } : {}),
    },
  }));
  const edgeElements = edges.flatMap((edge, index) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return [];
    if (isAncestor(edge.source, edge.target, parentById)) return [];
    if (isAncestor(edge.target, edge.source, parentById)) return [];

    return [{
      group: 'edges' as const,
      classes: edge.classes,
      data: {
        ...(edge.data ?? {}),
        id: edge.id ?? `${edge.source}->${edge.target}:${index}`,
        source: edge.source,
        target: edge.target,
      },
    }];
  });

  return [...nodeElements, ...edgeElements];
}

/*** Return whether one node owns the other through the compound parent chain. */
function isAncestor(
  possibleAncestor: string,
  nodeId: string,
  parentById: ReadonlyMap<string, string>
): boolean {
  const visited = new Set<string>();
  let current = parentById.get(nodeId);

  while (current !== undefined && !visited.has(current)) {
    if (current === possibleAncestor) return true;
    visited.add(current);
    current = parentById.get(current);
  }
  return false;
}

/*** Apply consumer style rules without exposing Cytoscape runtime objects through callbacks. */
function applyStyles(cy: Core, styleRules: readonly GraphViewStyleRule[] | undefined) {
  if (styleRules === undefined) return;
  cy.style(styleRules as StylesheetJson).update();
}

/*** Synchronize controlled node selection when supplied. */
function applySelectedNodes(cy: Core, selectedNodeIds: readonly string[] | undefined) {
  if (selectedNodeIds === undefined) return;
  const selectedIds = new Set(selectedNodeIds);
  cy.nodes().forEach((node) => {
    if (selectedIds.has(node.id())) node.select();
    else node.unselect();
  });
}

/*** Fit from node bounds only so invalid edge geometry can never distort the viewport. */
function fitNodes(cy: Core, padding: number) {
  if (cy.destroyed()) return;
  const nodes = cy.nodes();
  if (nodes.empty()) return;
  cy.fit(nodes, padding);
}

/*** Create the small imperative viewport surface exposed to consumers. */
function createController(
  cy: Core,
  fitPaddingRef: { current: number }
): GraphViewController {
  return {
    fit(padding) {
      fitNodes(cy, padding ?? fitPaddingRef.current);
    },
    getViewport() {
      return { zoom: cy.zoom(), pan: cy.pan() };
    },
    setPan(pan) {
      cy.pan(pan);
    },
    setZoom(zoom) {
      cy.zoom({
        level: zoom,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    },
  };
}

/*** Bind stable graph events while reading the latest React callback props through a ref. */
function bindGraphEvents(state: RuntimeState) {
  bindElementEvents(state, 'node');
  bindElementEvents(state, 'edge');
  state.cy.on('zoom pan', () => {
    state.callbacksRef.current.onViewportChange?.(state.controller.getViewport());
  });
}

/*** Translate Cytoscape element events into the stable ZORA graph event contract. */
function bindElementEvents(state: RuntimeState, selector: 'edge' | 'node') {
  const callback = selector === 'node' ? 'onNodeEvent' : 'onEdgeEvent';
  for (const [cyType, type] of EVENT_TYPES) {
    state.cy.on(cyType, selector, (event: EventObject) => {
      state.callbacksRef.current[callback]?.({
        id: String(event.target.id()),
        type,
      });
    });
  }
}

const EVENT_TYPES = [
  ['tap', 'press'],
  ['dbltap', 'double-press'],
  ['select', 'select'],
  ['unselect', 'unselect'],
  ['mouseover', 'pointer-enter'],
  ['mouseout', 'pointer-leave'],
] as const satisfies readonly (readonly [string, GraphViewElementEventType])[];

/*** Stop an active layout and invalidate all of its delayed completion work. */
function stopLayout(state: RuntimeState) {
  state.layoutGenerationRef.current += 1;
  state.layoutRunningRef.current = false;
  try {
    state.layoutRef.current?.stop();
  } catch {
    // Cytoscape may already have disposed the layout.
  }
  state.layoutRef.current = null;
}

/*** Dispose observers, layouts, listeners, and Cytoscape exactly once. */
function destroyRuntime(state: RuntimeState) {
  state.resizeObserver.disconnect();
  stopLayout(state);
  if (!state.cy.destroyed()) state.cy.destroy();
}

/*** Capture only callback props so runtime listeners never trigger effect resubscription. */
function toCallbacks(props: GraphViewProps): GraphViewCallbacks {
  return {
    onReady: props.onReady,
    onLayoutComplete: props.onLayoutComplete,
    onNodeEvent: props.onNodeEvent,
    onEdgeEvent: props.onEdgeEvent,
    onViewportChange: props.onViewportChange,
  };
}
