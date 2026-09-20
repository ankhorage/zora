import type { Core } from 'cytoscape';

import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { fitGraphViewport } from './fitGraphViewport';
import type { GraphViewController, GraphViewFitOptions } from './GraphView';

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
      if (fit) controller.fit();
      else if (state.relative) {
        setCenteredZoom(cy, logicalZoom * state.scale);
        cy.center(cy.nodes());
      }
    },
  };
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
 * @performance Cache the geometry-derived scale in the viewport owner; labels are included, edges excluded.
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
