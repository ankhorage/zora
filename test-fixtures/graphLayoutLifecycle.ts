import cytoscape from 'cytoscape';

import { registerGraphLayouts } from '../src/features/graph-view/adapters/inbound/web-artifact/registerGraphLayouts';
import { runDetachedGraphLayout } from '../src/features/graph-view/adapters/inbound/web-artifact/runDetachedGraphLayout';

registerGraphLayouts();
const cy = cytoscape({ headless: true, elements: [{ data: { id: 'a' } }, { data: { id: 'b' } }] });
const settled = Promise.withResolvers<void>();
const completed: boolean[] = [];
const options = {
  name: 'elk',
  elk: { algorithm: 'layered' },
  nodeLayoutOptions: (node: cytoscape.NodeSingular) => {
    node.cy().one('layoutstop', () => settled.resolve());
    return {};
  },
};
const session = runDetachedGraphLayout(cy, options, () => completed.push(true));
session.stop();
cy.destroy();
await settled.promise;
if (completed.length !== 0) throw new Error('A disposed graph accepted a stale ELK completion.');
