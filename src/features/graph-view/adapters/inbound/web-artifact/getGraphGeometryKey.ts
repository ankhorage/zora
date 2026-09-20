import type { Core } from 'cytoscape';

/***
 * Identifies layout-relevant leaf dimensions without including positions or presentation colors.
 * @performance
 * Adding viewport, color or arbitrary data to this key turns interaction updates into relayouts.
 * Measure after style reconciliation; actual size changes still require layout. Compound bounds
 * follow child positions, so keying their measured bounds would feed layout output back into input.
 * Styled geometry tests and runtime interaction tests protect these distinctions.
 */
export function getGraphGeometryKey(cy: Core): string {
  return JSON.stringify(
    cy.nodes().map((node) => {
      if (node.isParent()) return [node.id()];
      const dimensions = node.layoutDimensions({ nodeDimensionsIncludeLabels: true });
      return [node.id(), dimensions.w, dimensions.h];
    }),
  );
}
