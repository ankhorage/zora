import { expect, test } from 'bun:test';

import type { FlowNodeData } from '../../../types/flow';
import { getFlowPortAnchor } from './getFlowPortAnchor';

const nodes: readonly FlowNodeData[] = [
  {
    id: 'source',
    ports: [{ direction: 'output', id: 'out', label: 'Output' }],
    position: { x: 20, y: 40 },
    title: 'Source',
  },
  {
    id: 'target',
    ports: [{ direction: 'input', id: 'in', label: 'Input' }],
    position: { x: 400, y: 180 },
    title: 'Target',
  },
];

test('anchors edges at the rendered input and output port centers', () => {
  expect(getFlowPortAnchor(nodes, { nodeId: 'source', portId: 'out' })).toEqual({ x: 232, y: 112 });
  expect(getFlowPortAnchor(nodes, { nodeId: 'target', portId: 'in' })).toEqual({ x: 412, y: 252 });
});

test('does not invent an anchor for a missing port', () => {
  expect(getFlowPortAnchor(nodes, { nodeId: 'source', portId: 'missing' })).toBeUndefined();
});
