import { isRecord } from '@ankhorage/utility/object';
import type { Core } from 'cytoscape';

import { createRenderableGraphElements } from './createRenderableGraphElements';
import type { GraphViewEdge, GraphViewNode } from './GraphView';

/***
 * Reconciles graph data in one batch while retaining positions, selection and element identity.
 * @performance
 * Do not replace this with remove-all/add-all: presentation updates must not discard interaction
 * state or force the runtime to rebuild the graph. Use direct ID lookups for obsolete metadata;
 * per-element selector scans would add avoidable work. Runtime tests cover hover/selection updates.
 */
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
