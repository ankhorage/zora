import type { Core } from 'cytoscape';

import type {
  GraphViewController,
  GraphViewFitOptions,
  GraphViewMeasurement,
} from '../../../../../types/graph-view';
import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { fitGraphViewport } from './fitGraphViewport';

/*** Own viewport units and limits alongside the public controller, without exposing Cytoscape. */
export function createGraphController(
  cy: Core,
  fitPaddingRef: { current: number },
  optimizeFit?: (options: GraphViewFitOptions) => void,
) {
  const state = {
    scale: 1,
    relative: false,
    min: 0.05,
    max: 2,
    readableSize: 0,
    fitSize: Infinity,
    readableZoom: 0,
    fitZoom: Infinity,
    resizeSnapshot: null as GraphResizeSnapshot | null,
  };
  const controller: GraphViewController = {
    fit(options) {
      if (options?.optimizeSpacing && !options.nodeIds?.length && optimizeFit) {
        optimizeFit(options);
        return;
      }
      fitGraphViewport(
        cy,
        {
          nodeIds: options?.nodeIds,
          padding: options?.padding ?? fitPaddingRef.current,
        },
        state.fitZoom,
      );
    },
    measureNodes(nodeIds) {
      return measureRenderedNodes(cy, nodeIds);
    },
    getViewport() {
      return { pan: cy.pan(), zoom: cy.zoom() / state.scale };
    },
    getZoomRange() {
      return { min: cy.minZoom() / state.scale, max: cy.maxZoom() / state.scale };
    },
    setPan(pan) {
      cy.pan(pan);
    },
    setZoom(zoom) {
      setCenteredZoom(cy, zoom * state.scale);
    },
    zoomBy(factor) {
      setCenteredZoom(cy, cy.zoom() * factor);
    },
  };

  return {
    controller,
    configure(input: GraphRuntimeUpdate) {
      state.relative = input.zoomMode === 'fit-relative';
      state.min = input.minZoom ?? 0.05;
      state.max = input.maxZoom ?? 2;
      state.readableSize = positiveSize(input.minReadableLabelSize, 0);
      state.fitSize = positiveSize(input.maxFitLabelSize, Infinity);
      if (!state.relative) state.scale = 1;
      applyZoomLimits(cy, state);
    },
    /*** Return the native automatic-fit ceiling used by spacing optimization. */
    getFitZoomLimit() {
      return state.relative ? state.fitZoom : Math.min(state.fitZoom, state.max);
    },
    /*** Return the native label-readability threshold used before allowing background overlap. */
    getReadableZoomTarget() {
      return state.readableZoom;
    },
    /*** Capture the model point beneath the current viewport center before Cytoscape resizes. */
    beginResize() {
      state.resizeSnapshot = captureResizeSnapshot(cy);
    },
    settle(fit: boolean) {
      const logicalZoom = cy.zoom() / state.scale;
      const fonts = cy
        .nodes()
        .filter((node) => !node.isParent() && Boolean(node.style('label')))
        .map((node) => Number.parseFloat(String(node.style('font-size'))))
        .filter((size) => Number.isFinite(size) && size > 0);
      state.readableZoom = fonts.length
        ? state.readableSize / fonts.reduce((minimum, size) => Math.min(minimum, size), Infinity)
        : 0;
      state.fitZoom = fonts.length
        ? state.fitSize / fonts.reduce((maximum, size) => Math.max(maximum, size), 0)
        : Infinity;
      state.scale = state.relative
        ? Math.min(getNodeFitZoom(cy, fitPaddingRef.current), state.fitZoom)
        : 1;
      applyZoomLimits(cy, state);
      if (fit) {
        state.resizeSnapshot = null;
        controller.fit();
      } else if (settlePreservedViewport(cy, state, logicalZoom)) controller.fit();
    },
  };
}

interface GraphResizeSnapshot {
  readonly center: { readonly x: number; readonly y: number };
  readonly nodeBounds: GraphNodeBoundsStatus;
}

type GraphNodeBoundsStatus = 'clipped' | 'empty' | 'fit' | 'unusable';

/*** Capture the model-space center and whether the prior viewport was an intact graph fit. */
function captureResizeSnapshot(cy: Core): GraphResizeSnapshot | null {
  const viewport = { width: cy.width(), height: cy.height() };
  const zoom = cy.zoom();
  if (!isUsableViewport(viewport) || !Number.isFinite(zoom) || zoom <= 0) return null;
  const pan = cy.pan();
  const renderedCenter = { x: viewport.width / 2, y: viewport.height / 2 };
  return {
    center: {
      x: (renderedCenter.x - pan.x) / zoom,
      y: (renderedCenter.y - pan.y) / zoom,
    },
    nodeBounds: getNodeBoundsStatus(cy, viewport),
  };
}

/*** Preserve a manual viewport through resize, fitting only when an intact prior fit becomes invalid. */
function settlePreservedViewport(
  cy: Core,
  state: {
    readonly relative: boolean;
    resizeSnapshot: GraphResizeSnapshot | null;
    readonly scale: number;
  },
  logicalZoom: number,
): boolean {
  const snapshot = state.resizeSnapshot;
  state.resizeSnapshot = null;
  const zoom = state.relative ? logicalZoom * state.scale : cy.zoom();
  if (snapshot === null) {
    if (state.relative) setCenteredZoom(cy, zoom);
    return false;
  }
  const viewport = { width: cy.width(), height: cy.height() };
  if (!isUsableViewport(viewport)) return false;
  cy.viewport({
    zoom,
    pan: {
      x: viewport.width / 2 - snapshot.center.x * zoom,
      y: viewport.height / 2 - snapshot.center.y * zoom,
    },
  });
  const nodeBounds = getNodeBoundsStatus(cy, viewport);
  return nodeBounds === 'unusable' || (snapshot.nodeBounds === 'fit' && nodeBounds === 'clipped');
}

/*** Accept only finite non-empty node bounds that are wholly visible in a usable viewport. */
function getNodeBoundsStatus(
  cy: Core,
  viewport: { readonly width: number; readonly height: number },
): GraphNodeBoundsStatus {
  if (cy.nodes().empty()) return 'empty';
  if (!isUsableViewport(viewport)) return 'unusable';
  const bounds = cy.nodes().renderedBoundingBox();
  if (![bounds.x1, bounds.x2, bounds.y1, bounds.y2].every(Number.isFinite)) return 'unusable';
  const fitsHorizontally = bounds.x1 >= 0 && bounds.x2 <= viewport.width;
  const fitsVertically = bounds.y1 >= 0 && bounds.y2 <= viewport.height;
  return fitsHorizontally && fitsVertically ? 'fit' : 'clipped';
}

/*** Reject zero, negative, and non-finite renderer dimensions before viewport arithmetic. */
function isUsableViewport(viewport: { readonly width: number; readonly height: number }): boolean {
  return (
    Number.isFinite(viewport.width) &&
    Number.isFinite(viewport.height) &&
    viewport.width > 0 &&
    viewport.height > 0
  );
}

/*** Measure rendered node geometry for public consumers while keeping Cytoscape private. */
function measureRenderedNodes(cy: Core, nodeIds: readonly string[]): GraphViewMeasurement | null {
  const viewport = { width: cy.width(), height: cy.height() };
  if (viewport.width <= 0 || viewport.height <= 0 || nodeIds.length === 0) return null;

  const nodes = [...new Set(nodeIds)].flatMap((id) => {
    const node = cy.getElementById(id);
    if (!node.isNode()) return [];

    const bounds = node.renderedBoundingBox();
    return [
      {
        id,
        position: node.renderedPosition(),
        size: { width: bounds.w, height: bounds.h },
      },
    ];
  });
  return nodes.length === 0 ? null : { nodes, viewport };
}

/*** Keep pointer, wheel, and programmatic zoom on the same limits in the engine's native units. */
function applyZoomLimits(
  cy: Core,
  state: {
    readonly min: number;
    readonly max: number;
    readonly scale: number;
    readonly readableZoom: number;
  },
) {
  const min = state.min * state.scale;
  cy.minZoom(Math.min(cy.minZoom(), min));
  cy.maxZoom(Math.max(min, state.max * state.scale, state.readableZoom));
  cy.minZoom(min);
}

/*** Ignore invalid optional typography targets at the public configuration boundary. */
function positiveSize(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
}

/***
 * Recompute the fit reference only after layout or resize, never on every pan/zoom event.
 * Cache the geometry-derived scale in the viewport owner; labels are included, edges excluded.
 */
function getNodeFitZoom(cy: Core, padding: number): number {
  if (cy.nodes().empty()) return 1;
  const bounds = cy.nodes().boundingBox();
  const width = cy.width() - 2 * padding;
  const height = cy.height() - 2 * padding;
  if (width <= 0 || height <= 0 || bounds.w <= 0 || bounds.h <= 0) return 1;
  return Math.min(width / bounds.w, height / bounds.h);
}

/*** Zoom around the visible viewport center instead of its top-left corner. */
function setCenteredZoom(cy: Core, zoom: number) {
  cy.zoom({ level: zoom, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
}
