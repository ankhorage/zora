import { expect, test } from 'bun:test';

import { createRenderableGraphElements } from './createRenderableGraphElements';
import type { GraphViewEdge, GraphViewNode } from './GraphView';

test('omits compound ancestor and descendant edges without mutating source graph data', () => {
  const nodes: readonly GraphViewNode[] = [
    { id: 'projectadministration' },
    { id: 'projectadministration.domain', parentId: 'projectadministration' },
    { id: 'other' },
  ];
  const edges: readonly GraphViewEdge[] = [
    {
      id: 'invalid',
      source: 'projectadministration',
      target: 'projectadministration.domain',
    },
    {
      id: 'valid',
      source: 'projectadministration.domain',
      target: 'other',
    },
  ];

  const elements = createRenderableGraphElements(nodes, edges);
  const renderedEdgeIds = elements
    .filter((element) => element.group === 'edges')
    .map((element) => element.data.id);

  expect(renderedEdgeIds).toEqual(['valid']);
  expect(edges).toHaveLength(2);
});

test('keeps ordinary edges across unrelated compound branches', () => {
  const nodes: readonly GraphViewNode[] = [
    { id: 'a' },
    { id: 'a.child', parentId: 'a' },
    { id: 'b' },
    { id: 'b.child', parentId: 'b' },
  ];
  const edges: readonly GraphViewEdge[] = [{ id: 'cross', source: 'a.child', target: 'b.child' }];

  const elements = createRenderableGraphElements(nodes, edges);
  const renderedEdgeIds = elements
    .filter((element) => element.group === 'edges')
    .map((element) => element.data.id);

  expect(renderedEdgeIds).toEqual(['cross']);
});
