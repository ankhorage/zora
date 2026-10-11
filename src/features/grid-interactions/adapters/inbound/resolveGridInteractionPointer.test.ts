import { expect, test } from 'bun:test';

import { resolveGridInteractionPointer } from './resolveGridInteractionPointer';

test('normalizes nested responder coordinates against the interaction surface origin', () => {
  expect(
    resolveGridInteractionPointer(
      {
        nativeEvent: {
          locationX: 4,
          locationY: 6,
          pageX: 124,
          pageY: 86,
        },
      },
      { x: 120, y: 80 },
    ),
  ).toEqual({ x: 4, y: 6 });
});

test('uses responder-local coordinates when page coordinates are unavailable on native', () => {
  expect(
    resolveGridInteractionPointer(
      {
        nativeEvent: {
          locationX: 4,
          locationY: 6,
        },
      },
      { x: 120, y: 80 },
    ),
  ).toEqual({ x: 4, y: 6 });
});

test('carries a scoped web Space modifier snapshot without changing native event input', () => {
  expect(
    resolveGridInteractionPointer(
      {
        nativeEvent: {
          locationX: 4,
          locationY: 6,
        },
      },
      { x: 120, y: 80 },
      { spaceKey: true },
    ),
  ).toEqual({ spaceKey: true, x: 4, y: 6 });
});
