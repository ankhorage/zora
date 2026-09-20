import type { Core } from 'cytoscape';

import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { fitGraphViewport } from './fitGraphViewport';
import type { GraphViewController } from './GraphView';

/*** Own viewport units and limits alongside the public controller, without exposing Cytoscape. */
export function createGraphController(cy: Core, fitPaddingRef: { current: number }) {
  const state = { scale: 1, relative: false, min: 0.05, max: 2 };
  const controller: GraphViewController = {
    fit(options) {
      fitGraphViewport(cy, {
        nodeIds: options?.nodeIds,
        padding: options?.padding ?? fitPaddingRef.current,
      });
    },
    getViewport() {
      return { pan: cy.pan(), zoom: cy.zoom() / state.scale };
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
      if (!state.relative) state.scale = 1;
      applyZoomLimits(cy, state);
    },
    settle(fit: boolean) {
      const logicalZoom = cy.zoom() / state.scale;
      state.scale = state.relative ? getNodeFitZoom(cy, fitPaddingRef.current) : 1;
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
  state: { readonly min: number; readonly max: number; readonly scale: number },
) {
  const min = state.min * state.scale;
  cy.minZoom(Math.min(cy.minZoom(), min));
  cy.maxZoom(state.max * state.scale);
  cy.minZoom(min);
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
