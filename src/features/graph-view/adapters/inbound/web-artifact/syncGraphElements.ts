import type { Core } from 'cytoscape';

import type { GraphViewEdge, GraphViewNode } from './GraphView';
import { createRenderableGraphElements } from './createRenderableGraphElements';

/*** Replace Cytoscape elements from the current plain graph projection in one batch. */
export function syncGraphElements(
  cy: Core,
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[]
) {
  if (cy.destroyed()) return;

  const elements = createRenderableGraphElements(nodes, edges);
  cy.batch(() => {
    cy.elements().remove();
    cy.add(elements);
  });
}
