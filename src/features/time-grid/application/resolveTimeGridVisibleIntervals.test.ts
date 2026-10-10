import { expect, test } from 'bun:test';

import { resolveTimeGridVisibleIntervals } from './resolveTimeGridVisibleIntervals';

test('culls sparse intervals across both time and lane axes', () => {
  expect(
    resolveTimeGridVisibleIntervals(
      [
        { height: 20, id: 'drums' },
        { height: 40, id: 'bass' },
        { height: 30, id: 'strings' },
      ],
      [
        { extent: 4, id: 'intro', laneId: 'drums', start: 2 },
        { extent: 4, id: 'verse', laneId: 'bass', start: 20 },
        { extent: 4, id: 'outro', laneId: 'strings', start: 2 },
      ],
      { height: 45, offsetX: 0, offsetY: 0, pixelsPerUnitX: 1, pixelsPerUnitY: 1, width: 12 },
    ),
  ).toEqual([
    {
      extent: 4,
      height: 20,
      id: 'intro',
      laneId: 'drums',
      laneIndex: 0,
      start: 2,
      width: 4,
      x: 2,
      y: 0,
    },
  ]);
});
