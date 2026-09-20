import { isRecord } from '@ankhorage/utility/object';
import type { Core } from 'cytoscape';

import { createRenderableGraphElements } from './createRenderableGraphElements';
import type { GraphViewEdge, GraphViewNode } from './GraphView';

/*** Reconcile the graph projection while retaining current positions, selection, and element state. */
export function syncGraphElements(
  cy: Core,
  nodes: readonly GraphViewNode[],
  edges: readonly GraphViewEdge[],
) {
  if (cy.destroyed()) return;

  const elements = createRenderableGraphElements(nodes, edges);
  cy.batch(() => {
    for (const element of elements) {
      const existing = cy.getElementById(element.data.id ?? '');
      const data: unknown = existing.data();
      const obsoleteKeys = Object.keys(isRecord(data) ? data : {}).filter(
        (key) => !Object.hasOwn(element.data, key),
      );
      if (obsoleteKeys.length > 0) existing.removeData(obsoleteKeys.join(' '));
    }
    cy.json({ elements });
  });
}
