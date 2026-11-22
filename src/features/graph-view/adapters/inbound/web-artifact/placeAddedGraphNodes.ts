import type { Core } from 'cytoscape';

import type { GraphViewNode } from '../../../../../types/graph-view';

const GRID_GAP = 120;

/***
 * Give stable-topology additions deterministic positions without moving settled nodes.
 * This deliberately is not an incremental layout: callers can request a complete layout by
 * changing the configured algorithm, while ordinary controlled additions keep the user viewport.
 */
export function placeAddedGraphNodes(
  cy: Core,
  previousNodes: readonly GraphViewNode[],
  nodes: readonly GraphViewNode[],
) {
  const previousNodeIds = new Set(previousNodes.map((node) => node.id));
  const addedNodes = nodes
    .filter((node) => !previousNodeIds.has(node.id))
    .sort((left, right) => left.id.localeCompare(right.id));
  if (addedNodes.length === 0) return;

  const addedLeaves = addedNodes
    .map((node) => cy.getElementById(node.id))
    .filter((node) => !node.empty() && !node.isParent());
  if (addedLeaves.length === 0) return;

  const retainedNodes = cy
    .nodes()
    .filter((node) => previousNodeIds.has(node.id()) && !node.isParent());
  const bounds = retainedNodes.boundingBox({ includeEdges: false, includeLabels: true });
  const origin = retainedNodes.empty()
    ? getVisibleViewportCenter(cy)
    : { x: bounds.x2 + GRID_GAP, y: bounds.y1 };
  const columns = Math.ceil(Math.sqrt(addedLeaves.length));
  addedLeaves.forEach((graphNode, index) => {
    graphNode.position({
      x: origin.x + (index % columns) * GRID_GAP,
      y: origin.y + Math.floor(index / columns) * GRID_GAP,
    });
  });
}

/*** Return the model point at the center of the unchanged visible viewport. */
function getVisibleViewportCenter(cy: Core) {
  const extent = cy.extent();
  return {
    x: (extent.x1 + extent.x2) / 2,
    y: (extent.y1 + extent.y2) / 2,
  };
}
