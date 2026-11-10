import type { Core } from 'cytoscape';

/***
 * Identifies layout-relevant leaf dimensions without including positions or paint-only outlines.
 * Cytoscape's layoutDimensions() includes selected-outline rendering even though layouts use only
 * the node body, padding, border, and label bounds. Key those direct inputs instead. Compound
 * bounds follow child positions, so keying their measured bounds would feed layout output back
 * into input. Styled geometry tests and runtime interaction tests protect these distinctions.
 */
export function getGraphGeometryKey(cy: Core): string {
  return JSON.stringify(
    cy.nodes().map((node) => {
      if (node.isParent()) return [node.id()];
      const labelBounds = node.boundingBox({
        includeEdges: false,
        includeLabels: true,
        includeNodes: false,
        includeOverlays: false,
        includeUnderlays: false,
      });
      return [node.id(), node.outerWidth(), node.outerHeight(), labelBounds.w, labelBounds.h];
    }),
  );
}
