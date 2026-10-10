import { describe, expect, test } from 'bun:test';

import { createGridInteractionsController } from './createGridInteractionsController';

const viewport = {
  width: 100,
  height: 100,
  offsetX: 0,
  offsetY: 0,
  pixelsPerUnitX: 2,
  pixelsPerUnitY: 4,
};
const items = [
  { id: 'a', x: 1, y: 1, width: 3, height: 2 },
  { id: 'locked', x: 10, y: 1, width: 2, height: 2, locked: true },
];

describe('createGridInteractionsController', () => {
  test('maps independent viewport scales to a move preview without mutating items', () => {
    const intents: unknown[] = [];
    const controller = createGridInteractionsController({
      viewport,
      items,
      onIntent: (intent) => intents.push(intent),
    });
    controller.begin({ x: 3, y: 5 });
    controller.move({ x: 7, y: 13 });
    expect(intents).toEqual([
      { type: 'move', itemIds: ['a'], rects: [{ id: 'a', x: 3, y: 3, width: 3, height: 2 }] },
    ]);
    expect(items[0]).toEqual({ id: 'a', x: 1, y: 1, width: 3, height: 2 });
  });

  test('normalizes negative marquee drags and protects locked items', () => {
    const intents: unknown[] = [];
    const controller = createGridInteractionsController({
      viewport,
      items,
      marqueeMode: 'intersect',
      onIntent: (intent) => intents.push(intent),
    });
    controller.begin({ x: 24, y: 12 });
    controller.end({ x: 0, y: 0 });
    expect(intents).toEqual([
      { type: 'marquee', itemIds: ['a'], marquee: { x: 0, y: 0, width: 12, height: 3 } },
    ]);
  });
});
