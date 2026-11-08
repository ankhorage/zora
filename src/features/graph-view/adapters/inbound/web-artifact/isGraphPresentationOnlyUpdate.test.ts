import { expect, test } from 'bun:test';

import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { isGraphPresentationOnlyUpdate } from './isGraphPresentationOnlyUpdate';

const styleRules = [
  { selector: 'node', style: { width: 60, height: 40 } },
  { selector: 'node.highlight', style: { width: 120, height: 60 } },
] as const;

const input: GraphRuntimeUpdate = {
  nodes: [
    { id: 'src', label: 'src', data: { width: 60 } },
    { id: 'src.features', parentId: 'src', label: 'features', data: { width: 80 } },
  ],
  edges: [{ source: 'src', target: 'src.features', data: { weight: 1 } }],
  layout: 'grid',
  richNodeRendering: false,
  sizeNodesToLabels: true,
  styleRules,
};

test('treats a class-only selected-node update as presentation even when CSS changes size', () => {
  const selected: GraphRuntimeUpdate = {
    ...input,
    nodes: input.nodes.map((node) => ({ ...node, classes: 'highlight' })),
    edges: input.edges.map((edge) => ({ ...edge, classes: 'highlight' })),
  };
  expect(isGraphPresentationOnlyUpdate(input, selected)).toBe(true);
  expect(isGraphPresentationOnlyUpdate(selected, input)).toBe(true);
  expect(isGraphPresentationOnlyUpdate(null, input)).toBe(false);
});

test('recognizes rebuilt graph payloads without demanding reference-stable consumer data', () => {
  const rebuilt: GraphRuntimeUpdate = {
    ...input,
    nodes: input.nodes.map((node) => ({
      ...node,
      classes: 'hushed',
      data: { ...node.data },
    })),
    edges: input.edges.map((edge) => ({
      ...edge,
      classes: 'hushed',
      data: { ...edge.data },
    })),
  };
  expect(isGraphPresentationOnlyUpdate(input, rebuilt)).toBe(true);
});

test('allows real layout inputs to relayout, including labels, data, topology and style policy', () => {
  expect(
    isGraphPresentationOnlyUpdate(input, {
      ...input,
      nodes: input.nodes.map((node) => (node.id === 'src' ? { ...node, label: 'new' } : node)),
    }),
  ).toBe(false);
  expect(
    isGraphPresentationOnlyUpdate(input, {
      ...input,
      nodes: input.nodes.map((node) =>
        node.id === 'src' ? { ...node, data: { width: 120 } } : node,
      ),
    }),
  ).toBe(false);
  expect(
    isGraphPresentationOnlyUpdate(input, {
      ...input,
      nodes: [...input.nodes, { id: 'new' }],
    }),
  ).toBe(false);
  expect(
    isGraphPresentationOnlyUpdate(input, {
      ...input,
      edges: input.edges.map((edge) => ({ ...edge, data: { weight: 2 } })),
    }),
  ).toBe(false);
  expect(
    isGraphPresentationOnlyUpdate(input, {
      ...input,
      styleRules: [...styleRules],
    }),
  ).toBe(false);
});
