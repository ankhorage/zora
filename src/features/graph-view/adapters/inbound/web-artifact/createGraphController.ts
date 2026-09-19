import type { Core } from 'cytoscape';

import { fitGraphViewport } from './fitGraphViewport';
import type { GraphViewController } from './GraphView';

/*** Create the public viewport controller while keeping the Cytoscape core private. */
export function createGraphController(
  cy: Core,
  fitPaddingRef: { current: number },
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
      const zoom = cy.zoom() * factor;
      cy.zoom({
        level: zoom,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    },
  };
}
