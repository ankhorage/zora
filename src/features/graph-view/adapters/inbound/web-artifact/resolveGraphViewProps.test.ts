import { expect, test } from 'bun:test';

import type { Graph } from '@ankhorage/graph';

import type { GraphViewInput, GraphViewProps } from '../../../../../types/graph-view';
import { projectCanonicalGraph, resolveGraphViewProps } from './resolveGraphViewProps';

test('projects numeric IDs, native labels and relationship types without changing canonical payloads', () => {
  const graph = {
    nodes: [
      { id: 20, labels: ['Person', 'Employee'], data: { name: 'Ada', roles: ['maintainer'] } },
      { id: 10, labels: ['Team'], data: 'platform' },
    ],
    edges: [
      {
        id: 31,
        source: 20,
        target: 10,
        type: 'MEMBER_OF',
        data: { validFrom: '2020-01-01', validTo: null },
      },
      {
        id: 32,
        source: 20,
        target: 10,
        type: 'MEMBER_OF',
        data: { validFrom: '2024-01-01' },
      },
    ],
  } satisfies Graph<unknown, unknown, number, number>;

  const input: GraphViewInput = { graph, topologyUpdatePolicy: 'preserve-positions' };
  const projected = resolveGraphViewProps(input);

  expect(projected.nodes.map(({ id }) => id)).toEqual(['10', '20']);
  expect(projected.edges.map(({ id }) => id)).toEqual(['31', '32']);
  expect(projected.edges.map(({ source, target }) => [source, target])).toEqual([
    ['20', '10'],
    ['20', '10'],
  ]);
  expect(projected.nodes[1]?.data).toEqual({ canonicalNode: graph.nodes[0] });
  expect(projected.edges[0]?.data).toEqual({ canonicalEdge: graph.edges[0] });
});

test('omits canonical edges with missing endpoints deterministically', () => {
  const graph = {
    nodes: [
      { id: 'b', data: {} },
      { id: 'a', data: {} },
    ],
    edges: [
      { id: 'missing-first', source: 'missing', target: 'a', data: {} },
      { id: 'visible', source: 'b', target: 'a', data: {} },
      { id: 'missing-last', source: 'a', target: 'missing', data: {} },
    ],
  } satisfies Graph;

  expect(projectCanonicalGraph(graph)).toEqual({
    nodes: [
      { data: { canonicalNode: graph.nodes[1] }, id: 'a' },
      { data: { canonicalNode: graph.nodes[0] }, id: 'b' },
    ],
    edges: [
      {
        data: { canonicalEdge: graph.edges[1] },
        id: 'visible',
        source: 'b',
        target: 'a',
      },
    ],
  });
});

test('rejects canonical IDs that collide after string projection', () => {
  const graph = {
    nodes: [
      { id: 1, data: {} },
      { id: '1', data: {} },
    ],
    edges: [],
  } satisfies Graph<unknown, unknown, number | string>;

  expect(() => projectCanonicalGraph(graph)).toThrow(
    'Canonical graph IDs collide after GraphView string projection.',
  );
});

test('retains the original nodes and edges API without reconciliation changes', () => {
  const props: GraphViewProps = {
    edges: [{ id: 'edge', source: 'one', target: 'two' }],
    nodes: [{ id: 'one' }, { id: 'two' }],
    topologyUpdatePolicy: 'preserve-positions',
  };

  expect(resolveGraphViewProps(props)).toBe(props);
});
