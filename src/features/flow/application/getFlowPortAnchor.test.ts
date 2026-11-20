import { expect, test } from 'bun:test';

import { getFlowPortAnchor, getFlowPortAnchorKey } from './getFlowPortAnchor';

test('anchors edges at measured port centers regardless of node size or port order', () => {
  const anchors = new Map([
    [getFlowPortAnchorKey({ nodeId: 'source', portId: 'out' }), { x: 351, y: 204 }],
    [getFlowPortAnchorKey({ nodeId: 'target', portId: 'in' }), { x: 414, y: 628 }],
  ]);

  expect(getFlowPortAnchor(anchors, { nodeId: 'source', portId: 'out' })).toEqual({
    x: 351,
    y: 204,
  });
  expect(getFlowPortAnchor(anchors, { nodeId: 'target', portId: 'in' })).toEqual({
    x: 414,
    y: 628,
  });
});

test('does not invent an anchor for a missing port', () => {
  expect(getFlowPortAnchor(new Map(), { nodeId: 'source', portId: 'missing' })).toBeUndefined();
});
