import type { Core } from 'cytoscape';

/***
 * Size plain leaf nodes from the renderer's styled label bounds, keeping padding in the stylesheet.
 * @performance Reuse Cytoscape's cached text measurements during reconciliation, never a per-element
 * style callback or a pan/zoom listener. Only write changed dimensions; bold and Unicode labels must
 * not regress to character-count estimates. Compound dimensions remain owned by child bounds.
 */
export function sizeGraphNodesToLabels(cy: Core, sizedNodeIds: Set<string>, enabled: boolean) {
  if (!enabled) {
    for (const id of sizedNodeIds) cy.getElementById(id).removeStyle('width height');
    sizedNodeIds.clear();
    return;
  }
  const visibleIds = new Set<string>();
  cy.nodes(':childless').forEach((node) => {
    const bounds = node.boundingBox({
      includeNodes: false,
      includeEdges: false,
      includeLabels: true,
      includeOverlays: false,
      includeUnderlays: false,
    });
    if (bounds.w <= 0 || bounds.h <= 0) return;
    const width = Math.ceil(bounds.w);
    const height = Math.ceil(bounds.h);
    if (node.width() !== width || node.height() !== height) node.style({ width, height });
    visibleIds.add(node.id());
  });
  for (const id of sizedNodeIds) {
    if (!visibleIds.has(id)) {
      cy.getElementById(id).removeStyle('width height');
      sizedNodeIds.delete(id);
    }
  }
  for (const id of visibleIds) sizedNodeIds.add(id);
}
