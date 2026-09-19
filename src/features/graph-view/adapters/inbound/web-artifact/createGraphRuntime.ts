import cytoscape, { type Core, type CytoscapeOptions, type StylesheetJson } from 'cytoscape';
import elk from 'cytoscape-elk';

import type {
  GraphViewCallbacks,
  GraphViewController,
  GraphViewEdge,
  GraphViewLayoutName,
  GraphViewNode,
  GraphViewStyleRule,
} from './GraphView';
import { bindGraphEvents } from './bindGraphEvents';
import { fitGraphViewport } from './fitGraphViewport';
import { runGraphLayout } from './runGraphLayout';
import { syncGraphElements } from './syncGraphElements';

cytoscape.use(elk as cytoscape.Ext);

type GraphContainer = NonNullable<CytoscapeOptions['container']>;

interface GraphRuntimeUpdate {
  readonly edges: readonly GraphViewEdge[];
  readonly fitPadding?: number;
  readonly layout?: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  readonly maxZoom?: number;
  readonly minZoom?: number;
  readonly nodes: readonly GraphViewNode[];
  readonly spacingFactor?: number;
  readonly styleRules?: readonly GraphViewStyleRule[];
}

export interface GraphRuntime {
  destroy(): void;
  setSelectedNodeIds(nodeIds: readonly string[] | undefined): void;
  update(input: GraphRuntimeUpdate): void;
}

interface GraphRuntimeState {
  readonly callbacksRef: { current: GraphViewCallbacks };
  readonly controller: GraphViewController;
  readonly cy: Core;
  readonly fitPaddingRef: { current: number };
  readonly generationRef: { current: number };
  readonly layoutRef: { current: ReturnType<typeof runGraphLayout> | null };
  readonly layoutRunningRef: { current: boolean };
  readonly readyRef: { current: boolean };
  readonly resizeObserver: ResizeObserverLike | null;
  readonly unbindEvents: () => void;
}

/*** Create one Cytoscape runtime that exclusively owns layout, fit, resize, and disposal. */
export function createGraphRuntime(
  container: GraphContainer,
  callbacksRef: { current: GraphViewCallbacks }
): GraphRuntime {
  const cy = cytoscape({
    container,
    elements: [],
    minZoom: 0.05,
    maxZoom: 2,
    selectionType: 'additive',
    userPanningEnabled: true,
  });
  const fitPaddingRef = { current: 50 };
  const controller = createController(cy, fitPaddingRef);
  const state = createRuntimeState(cy, controller, callbacksRef, fitPaddingRef);

  return {
    destroy() {
      destroyRuntime(state);
    },
    setSelectedNodeIds(nodeIds) {
      setSelectedNodeIds(cy, nodeIds);
    },
    update(input) {
      updateRuntime(state, input);
    },
  };
}

/*** Build the mutable runtime state around one Cytoscape core instance. */
function createRuntimeState(
  cy: Core,
  controller: GraphViewController,
  callbacksRef: { current: GraphViewCallbacks },
  fitPaddingRef: { current: number }
): GraphRuntimeState {
  const layoutRunningRef = { current: false };
  const readyRef = { current: false };
  const resizeObserver = createResizeObserver(cy, layoutRunningRef, readyRef, fitPaddingRef);
  const unbindEvents = bindGraphEvents(cy, callbacksRef, controller);
  resizeObserver?.observe(cy.container());

  return {
    callbacksRef,
    controller,
    cy,
    fitPaddingRef,
    generationRef: { current: 0 },
    layoutRef: { current: null },
    layoutRunningRef,
    readyRef,
    resizeObserver,
    unbindEvents,
  };
}

/*** Apply one graph update and start exactly one new layout generation. */
function updateRuntime(state: GraphRuntimeState, input: GraphRuntimeUpdate) {
  if (state.cy.destroyed()) return;
  stopCurrentLayout(state);
  state.fitPaddingRef.current = input.fitPadding ?? 50;
  state.cy.minZoom(input.minZoom ?? 0.05);
  state.cy.maxZoom(input.maxZoom ?? 2);
  syncGraphElements(state.cy, input.nodes, input.edges);
  applyGraphStyles(state.cy, input.styleRules);
  startCurrentLayout(state, input);
}

/*** Start a generation-safe layout whose completion is the only normal automatic fit trigger. */
function startCurrentLayout(state: GraphRuntimeState, input: GraphRuntimeUpdate) {
  const generation = state.generationRef.current + 1;
  state.generationRef.current = generation;
  state.layoutRunningRef.current = true;
  state.cy.resize();

  state.layoutRef.current = runGraphLayout(
    state.cy,
    {
      layout: input.layout ?? 'concentric',
      layoutOptions: input.layoutOptions,
      spacingFactor: input.spacingFactor ?? 1,
    },
    () => completeCurrentLayout(state, generation)
  );
}

/*** Settle only the latest layout generation and fit from node bounds after one browser frame. */
function completeCurrentLayout(state: GraphRuntimeState, generation: number) {
  state.layoutRef.current = null;
  scheduleFrame(() => {
    if (state.cy.destroyed() || generation !== state.generationRef.current) return;
    state.cy.resize();
    state.layoutRunningRef.current = false;
    if (!hasUsableViewport(state.cy)) return;

    fitGraphViewport(state.cy, { padding: state.fitPaddingRef.current });
    if (!state.readyRef.current) {
      state.readyRef.current = true;
      state.callbacksRef.current.onReady?.(state.controller);
    }
    state.callbacksRef.current.onLayoutComplete?.(state.controller);
  });
}

/*** Stop the current layout before replacement and invalidate every stale completion callback. */
function stopCurrentLayout(state: GraphRuntimeState) {
  state.generationRef.current += 1;
  state.layoutRunningRef.current = false;
  state.layoutRef.current?.stop();
  state.layoutRef.current = null;
}

/*** Apply consumer Cytoscape style rules without giving consumers runtime ownership. */
function applyGraphStyles(cy: Core, rules: readonly GraphViewStyleRule[] | undefined) {
  if (rules === undefined) return;
  cy.style(rules as StylesheetJson).update();
}

/*** Synchronize controlled selection without rerunning layout. */
function setSelectedNodeIds(cy: Core, nodeIds: readonly string[] | undefined) {
  if (cy.destroyed() || nodeIds === undefined) return;
  const selectedIds = new Set(nodeIds);
  cy.nodes().forEach((node) => {
    if (selectedIds.has(node.id())) node.select();
    else node.unselect();
  });
}

/*** Create the public viewport controller while keeping the Cytoscape core private. */
function createController(
  cy: Core,
  fitPaddingRef: { current: number }
): GraphViewController {
  return {
    fit(options) {
      fitGraphViewport(cy, {
        nodeIds: options?.nodeIds,
        padding: options?.padding ?? fitPaddingRef.current,
      });
    },
    getViewport() {
      return { pan: cy.pan(), zoom: cy.zoom() };
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
    zoomBy(factor) {
      this.setZoom(cy.zoom() * factor);
    },
  };
}

/*** Observe actual post-ready container size changes without competing with layout completion. */
function createResizeObserver(
  cy: Core,
  layoutRunningRef: { current: boolean },
  readyRef: { current: boolean },
  fitPaddingRef: { current: number }
): ResizeObserverLike | null {
  const Observer = readResizeObserverConstructor();
  if (Observer === null) return null;

  let lastWidth = -1;
  let lastHeight = -1;
  return new Observer((entries) => {
    const entry = entries.at(0);
    if (entry === undefined) return;
    const { width, height } = entry.contentRect;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    if (!readyRef.current || layoutRunningRef.current) return;

    scheduleFrame(() => {
      if (cy.destroyed() || layoutRunningRef.current) return;
      cy.resize();
      fitGraphViewport(cy, { padding: fitPaddingRef.current });
    });
  });
}

/*** Read the browser ResizeObserver without imposing DOM library types on the package. */
function readResizeObserverConstructor(): ResizeObserverConstructorLike | null {
  const value = (globalThis as unknown as { ResizeObserver?: ResizeObserverConstructorLike })
    .ResizeObserver;
  return value ?? null;
}

/*** Schedule viewport work after layout painting while retaining a non-browser fallback. */
function scheduleFrame(callback: () => void) {
  const frame = (
    globalThis as unknown as {
      requestAnimationFrame?: (scheduled: () => void) => number;
    }
  ).requestAnimationFrame;
  if (frame) {
    frame(callback);
    return;
  }
  setTimeout(callback, 0);
}

/*** Return whether Cytoscape currently has dimensions suitable for fitting. */
function hasUsableViewport(cy: Core): boolean {
  return cy.width() > 0 && cy.height() > 0;
}

/*** Dispose all runtime resources in the reverse order they were acquired. */
function destroyRuntime(state: GraphRuntimeState) {
  state.resizeObserver?.disconnect();
  stopCurrentLayout(state);
  state.unbindEvents();
  if (!state.cy.destroyed()) state.cy.destroy();
}

interface ResizeObserverEntryLike {
  readonly contentRect: {
    readonly width: number;
    readonly height: number;
  };
}

interface ResizeObserverLike {
  disconnect(): void;
  observe(target: unknown): void;
}

interface ResizeObserverConstructorLike {
  new (callback: (entries: readonly ResizeObserverEntryLike[]) => void): ResizeObserverLike;
}
