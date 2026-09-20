import cytoscape, { type Core, type CytoscapeOptions } from 'cytoscape';

import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { bindGraphEvents } from './bindGraphEvents';
import { createGraphController } from './createGraphController';
import { createGraphResizeObserver, type GraphResizeObserver } from './createGraphResizeObserver';
import { fitGraphViewport } from './fitGraphViewport';
import { getGraphGeometryKey } from './getGraphGeometryKey';
import { getGraphTopologyKey } from './getGraphTopologyKey';
import type {
  GraphViewCallbacks,
  GraphViewElementEventType,
  GraphViewRenderedNode,
  GraphViewSize,
  GraphViewStyleRule,
} from './GraphView';
import { hasGraphLayoutChanged } from './hasGraphLayoutChanged';
import { readGraphRenderedNodes } from './readGraphRenderedNodes';
import { registerGraphLayouts } from './registerGraphLayouts';
import { runGraphLayout } from './runGraphLayout';
import { scheduleGraphFrame } from './scheduleGraphFrame';
import { shouldFitGraphAfterLayout } from './shouldFitGraphAfterLayout';
import { syncGraphElements } from './syncGraphElements';

type GraphContainer = CytoscapeOptions['container'];
type RenderedNodeListener = (nodes: readonly GraphViewRenderedNode[]) => void;

export interface GraphRuntime {
  destroy(): void;
  handleOverlayNodeEvent(id: string, type: GraphViewElementEventType): void;
  setNodeSize(id: string, size: GraphViewSize): void;
  setSelectedNodeIds(nodeIds: readonly string[] | undefined): void;
  subscribeRenderedNodes(listener: RenderedNodeListener): () => void;
  update(input: GraphRuntimeUpdate): void;
}

interface GraphRuntimeState {
  readonly callbacksRef: { current: GraphViewCallbacks };
  readonly controller: ReturnType<typeof createGraphController>;
  readonly cy: Core;
  readonly fitPaddingRef: { current: number };
  readonly generationRef: { current: number };
  readonly geometryRef: { current: string | null };
  readonly hoveredNodeIds: Set<string>;
  readonly latestUpdateRef: { current: GraphRuntimeUpdate | null };
  readonly layoutRef: { current: ReturnType<typeof runGraphLayout> | null };
  readonly layoutRunningRef: { current: boolean };
  readonly nodeSizes: Map<string, GraphViewSize>;
  readonly readyRef: { current: boolean };
  readonly settledTopologyRef: { current: string | null };
  readonly relayoutScheduledRef: { current: boolean };
  readonly renderedNodeListeners: Set<RenderedNodeListener>;
  readonly resizeObserver: GraphResizeObserver | null;
  readonly unbindEvents: () => void;
}

/*** Create one Cytoscape runtime that exclusively owns layout, fit, resize, and disposal. */
export function createGraphRuntime(
  container: GraphContainer,
  callbacksRef: { current: GraphViewCallbacks },
): GraphRuntime {
  const cy = cytoscape({
    container,
    elements: [],
    minZoom: 0.05,
    maxZoom: 2,
    selectionType: 'additive',
    userPanningEnabled: true,
  });
  const state = createRuntimeState(cy, container, callbacksRef);

  return {
    destroy: () => destroyRuntime(state),
    handleOverlayNodeEvent: (id, type) => handleOverlayNodeEvent(state, id, type),
    setNodeSize: (id, size) => setNodeSize(state, id, size),
    setSelectedNodeIds: (nodeIds) => setSelectedNodeIds(state, nodeIds),
    subscribeRenderedNodes: (listener) => subscribeRenderedNodes(state, listener),
    update: (input) => updateRuntime(state, input),
  };
}

/*** Build the mutable state shared by the single graph-runtime owner. */
function createRuntimeState(
  cy: Core,
  container: GraphContainer,
  callbacksRef: { current: GraphViewCallbacks },
): GraphRuntimeState {
  const fitPaddingRef = { current: 50 };
  const controller = createGraphController(cy, fitPaddingRef);
  const layoutRunningRef = { current: false };
  const readyRef = { current: false };
  const renderedNodeListeners = new Set<RenderedNodeListener>();
  const stateBase = {
    callbacksRef,
    controller,
    cy,
    fitPaddingRef,
    generationRef: { current: 0 },
    geometryRef: { current: null as string | null },
    hoveredNodeIds: new Set<string>(),
    latestUpdateRef: { current: null as GraphRuntimeUpdate | null },
    layoutRef: { current: null as ReturnType<typeof runGraphLayout> | null },
    layoutRunningRef,
    nodeSizes: new Map<string, GraphViewSize>(),
    readyRef,
    settledTopologyRef: { current: null as string | null },
    relayoutScheduledRef: { current: false },
    renderedNodeListeners,
  };
  const unbindEvents = bindGraphEvents(cy, callbacksRef, controller, () =>
    emitRenderedNodes(stateBase),
  );
  const resizeObserver = createGraphResizeObserver({
    container,
    cy,
    fitPaddingRef,
    layoutRunningRef,
    onViewportSettled: () => emitRenderedNodes(stateBase),
    readyRef,
  });

  return { ...stateBase, resizeObserver, unbindEvents };
}

/***
 * Reconcile presentation in place and relayout only when graph geometry or layout policy changes.
 * @performance Batch reconciliation and skip layout for presentation-only updates.
 */
function updateRuntime(state: GraphRuntimeState, input: GraphRuntimeUpdate) {
  if (state.cy.destroyed()) return;
  const previous = state.latestUpdateRef.current;
  state.latestUpdateRef.current = input;
  state.fitPaddingRef.current = input.fitPadding ?? 50;
  state.cy.minZoom(input.minZoom ?? 0.05);
  state.cy.maxZoom(input.maxZoom ?? 2);
  state.cy.batch(() => {
    if (previous?.nodes !== input.nodes || previous.edges !== input.edges) {
      syncGraphElements(state.cy, input.nodes, input.edges);
    }
    if (
      previous?.styleRules !== input.styleRules ||
      previous?.richNodeRendering !== input.richNodeRendering
    ) {
      applyGraphStyles(state.cy, input.styleRules, input.richNodeRendering);
    }
    applyKnownNodeSizes(state);
  });
  const geometry = getGraphGeometryKey(state.cy);
  const relayout = geometry !== state.geometryRef.current || hasGraphLayoutChanged(previous, input);
  state.geometryRef.current = geometry;
  if (!relayout) {
    emitRenderedNodes(state);
    if (!state.layoutRunningRef.current)
      state.callbacksRef.current.onLayoutComplete?.(state.controller);
    return;
  }
  stopCurrentLayout(state);
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
    () => completeCurrentLayout(state, generation),
  );
}

/***
 * Settle only the latest layout generation and fit once from node bounds.
 * @performance Discard stale completions and avoid repeated automatic fits.
 */
function completeCurrentLayout(state: GraphRuntimeState, generation: number) {
  scheduleGraphFrame(() => {
    if (state.cy.destroyed() || generation !== state.generationRef.current) return;
    state.layoutRef.current = null;
    state.cy.resize();
    state.layoutRunningRef.current = false;
    if (!hasUsableViewport(state.cy)) return;
    const input = state.latestUpdateRef.current;
    if (input === null) return;
    const topology = getGraphTopologyKey(input.nodes, input.edges);
    const shouldFit = shouldFitGraphAfterLayout(
      state.readyRef.current,
      topology !== state.settledTopologyRef.current,
    );
    if (shouldFit) fitGraphViewport(state.cy, { padding: state.fitPaddingRef.current });
    state.settledTopologyRef.current = topology;
    emitRenderedNodes(state);

    if (!state.readyRef.current) {
      state.readyRef.current = true;
      state.callbacksRef.current.onReady?.(state.controller);
    }
    state.callbacksRef.current.onLayoutComplete?.(state.controller);
  });
}

/*** Stop the current layout and invalidate every stale completion callback. */
function stopCurrentLayout(state: GraphRuntimeState) {
  state.generationRef.current += 1;
  state.layoutRunningRef.current = false;
  state.layoutRef.current?.stop();
  state.layoutRef.current = null;
}

/*** Apply consumer styles and hide native node paint only when React rich nodes are active. */
function applyGraphStyles(
  cy: Core,
  rules: readonly GraphViewStyleRule[] | undefined,
  richNodeRendering: boolean,
) {
  const styles = [...(rules ?? [])];
  if (richNodeRendering) {
    styles.push({
      selector: 'node',
      style: {
        'background-opacity': 0,
        'border-width': 0,
        label: '',
        'overlay-opacity': 0,
      },
    });
  }
  if (styles.length > 0) cy.style(styles).update();
}

/***
 * Synchronize controlled selection without rerunning layout.
 * @performance Selection updates must not trigger graph reconstruction or layout.
 */
function setSelectedNodeIds(state: GraphRuntimeState, nodeIds: readonly string[] | undefined) {
  if (state.cy.destroyed() || nodeIds === undefined) return;
  const selectedIds = new Set(nodeIds);
  state.cy.nodes().forEach((node) => {
    if (selectedIds.has(node.id())) node.select();
    else node.unselect();
  });
  emitRenderedNodes(state);
}

/***
 * Persist one rich-node size and schedule at most one relayout for changed geometry.
 * @performance Ignore unchanged measurements before scheduling layout work.
 */
function setNodeSize(state: GraphRuntimeState, id: string, size: GraphViewSize) {
  const previous = state.nodeSizes.get(id);
  if (previous?.width === size.width && previous.height === size.height) return;
  state.nodeSizes.set(id, size);
  applyNodeSize(state.cy, id, size);
  scheduleMeasuredNodeRelayout(state);
}

/*** Apply every known rich-node size after Cytoscape elements are replaced. */
function applyKnownNodeSizes(state: GraphRuntimeState) {
  for (const [id, size] of state.nodeSizes) applyNodeSize(state.cy, id, size);
}

/*** Apply one measured model-space size as a Cytoscape per-node style bypass. */
function applyNodeSize(cy: Core, id: string, size: GraphViewSize) {
  const node = cy.getElementById(id);
  if (node.empty()) return;
  node.style({ height: size.height, width: size.width });
}

/***
 * Coalesce DOM measurements into one follow-up layout generation.
 * @performance Keep one scheduled layout per frame instead of one per measured node.
 */
function scheduleMeasuredNodeRelayout(state: GraphRuntimeState) {
  if (state.relayoutScheduledRef.current) return;
  state.relayoutScheduledRef.current = true;
  scheduleGraphFrame(() => {
    state.relayoutScheduledRef.current = false;
    const input = state.latestUpdateRef.current;
    if (input === null || state.cy.destroyed()) return;
    stopCurrentLayout(state);
    startCurrentLayout(state, input);
  });
}

/*** Subscribe one React overlay to rendered node state without exposing the Cytoscape core. */
function subscribeRenderedNodes(state: GraphRuntimeState, listener: RenderedNodeListener) {
  state.renderedNodeListeners.add(listener);
  listener(readGraphRenderedNodes(state.cy, state.hoveredNodeIds));
  return () => {
    state.renderedNodeListeners.delete(listener);
  };
}

/***
 * Publish current rendered node positions only to active rich-node subscribers.
 * @performance Skip snapshot preparation when no overlay is subscribed.
 */
function emitRenderedNodes(
  state: Pick<GraphRuntimeState, 'cy' | 'hoveredNodeIds' | 'renderedNodeListeners'>,
) {
  if (state.renderedNodeListeners.size === 0) return;
  const nodes = readGraphRenderedNodes(state.cy, state.hoveredNodeIds);
  for (const listener of state.renderedNodeListeners) listener(nodes);
}

/*** Translate one rich-overlay event back into normal graph selection and callbacks. */
function handleOverlayNodeEvent(
  state: GraphRuntimeState,
  id: string,
  type: GraphViewElementEventType,
) {
  if (type === 'pointer-enter') state.hoveredNodeIds.add(id);
  if (type === 'pointer-leave') state.hoveredNodeIds.delete(id);
  if (type === 'press') state.cy.getElementById(id).select();
  state.callbacksRef.current.onNodeEvent?.({ id, type });
  emitRenderedNodes(state);
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
  state.renderedNodeListeners.clear();
  if (!state.cy.destroyed()) state.cy.destroy();
}

registerGraphLayouts();
