import type { Core } from 'cytoscape';

import type { GraphViewRenderedNode } from './GraphView';

/*** Read React-overlay node state from Cytoscape's authoritative rendered positions. */
export function readGraphRenderedNodes(
  cy: Core,
  hoveredNodeIds: ReadonlySet<string>,
): readonly GraphViewRenderedNode[] {
  if (cy.destroyed()) return [];
  const zoom = cy.zoom();

  return cy.nodes().map((node) => ({
    hovered: hoveredNodeIds.has(node.id()),
    id: node.id(),
    position: node.renderedPosition(),
    selected: node.selected(),
    zoom,
  }));
}
