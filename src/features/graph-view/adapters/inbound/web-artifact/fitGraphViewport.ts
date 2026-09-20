import type { Core } from 'cytoscape';

import type { GraphViewFitOptions } from './GraphView';

/*** Fit the requested visible nodes and never include edge geometry in viewport bounds. */
export function fitGraphViewport(
  cy: Core,
  options: GraphViewFitOptions = {},
  maxZoom = Infinity,
): boolean {
  if (cy.destroyed()) return false;
  const nodes = getFitNodes(cy, options.nodeIds);
  if (nodes.empty()) return false;

  cy.fit(nodes, options.padding ?? 50);
  if (cy.zoom() > maxZoom) {
    cy.zoom(maxZoom);
    cy.center(nodes);
  }
  return true;
}

/*** Resolve an optional node-id target without ever adding edges to the fit collection. */
function getFitNodes(cy: Core, nodeIds: readonly string[] | undefined) {
  if (nodeIds === undefined || nodeIds.length === 0) return cy.nodes();
  const requestedIds = new Set(nodeIds);
  return cy.nodes().filter((node) => requestedIds.has(node.id()));
}
