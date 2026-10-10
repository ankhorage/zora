import { expect, test } from 'bun:test';

import { resolveTimeGridNextFocusId } from './resolveTimeGridNextFocusId';

const placements = [
  {
    extent: 4,
    height: 20,
    id: 'drums-a',
    laneId: 'drums',
    laneIndex: 0,
    start: 2,
    width: 4,
    x: 2,
    y: 0,
  },
  {
    extent: 4,
    height: 20,
    id: 'drums-b',
    laneId: 'drums',
    laneIndex: 0,
    start: 12,
    width: 4,
    x: 12,
    y: 0,
  },
  {
    extent: 4,
    height: 20,
    id: 'bass-a',
    laneId: 'bass',
    laneIndex: 1,
    start: 3,
    width: 4,
    x: 3,
    y: 20,
  },
] as const;

test('moves keyboard focus by interval geometry without calendar or music semantics', () => {
  expect(resolveTimeGridNextFocusId(placements, 'drums-a', 'right')).toBe('drums-b');
  expect(resolveTimeGridNextFocusId(placements, 'drums-b', 'left')).toBe('drums-a');
  expect(resolveTimeGridNextFocusId(placements, 'drums-a', 'down')).toBe('bass-a');
  expect(resolveTimeGridNextFocusId(placements, 'bass-a', 'up')).toBe('drums-a');
});
