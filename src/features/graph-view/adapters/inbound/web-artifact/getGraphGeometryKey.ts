import type { Core } from 'cytoscape';

/*** Identify layout-relevant leaf dimensions without including positions or presentation colors. */
export function getGraphGeometryKey(cy: Core): string {
  return JSON.stringify(
    cy.nodes().map((node) => {
      if (node.isParent()) return [node.id()];
      const dimensions = node.layoutDimensions({ nodeDimensionsIncludeLabels: true });
      return [node.id(), dimensions.w, dimensions.h];
    }),
  );
}
