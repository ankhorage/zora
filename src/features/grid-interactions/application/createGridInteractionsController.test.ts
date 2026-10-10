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

  test('keeps an active gesture while updating controlled props after a parent rerender', () => {
    const initialIntents: unknown[] = [];
    const rerenderedIntents: unknown[] = [];
    const controller = createGridInteractionsController({
      viewport,
      items,
      onIntent: (intent) => initialIntents.push(intent),
    });

    controller.begin({ x: 3, y: 5 });
    controller.update({
      viewport,
      items,
      onIntent: (intent) => rerenderedIntents.push(intent),
    });
    controller.end({ x: 7, y: 13 });

    expect(initialIntents).toEqual([]);
    expect(rerenderedIntents).toEqual([
      { type: 'move', itemIds: ['a'], rects: [{ id: 'a', x: 3, y: 3, width: 3, height: 2 }] },
    ]);
  });

  test('emits keyboard resize and accelerated movement only while interaction is enabled', () => {
    const intents: unknown[] = [];
    const controller = createGridInteractionsController({
      viewport,
      items,
      onIntent: (intent) => intents.push(intent),
      selectedIds: ['a'],
    });

    expect(controller.keyDown('ArrowRight', { x: 0, y: 0, altKey: true })).toBe(true);
    expect(controller.keyDown('ArrowDown', { x: 0, y: 0, shiftKey: true })).toBe(true);
    controller.update({
      interactionPolicy: 'passive',
      viewport,
      items,
      onIntent: (intent) => intents.push(intent),
      selectedIds: ['a'],
    });
    expect(controller.keyDown('ArrowLeft', { x: 0, y: 0 })).toBe(false);
    controller.begin({ x: 3, y: 5 });
    controller.end({ x: 7, y: 13 });

    expect(intents).toEqual([
      { type: 'resize', itemIds: ['a'], rects: [{ id: 'a', x: 1, y: 1, width: 4, height: 2 }] },
      { type: 'move', itemIds: ['a'], rects: [{ id: 'a', x: 1, y: 11, width: 3, height: 2 }] },
    ]);
  });

  test('emits handle-driven resize intents for a pointer gesture', () => {
    const intents: unknown[] = [];
    const controller = createGridInteractionsController({
      viewport,
      items,
      onIntent: (intent) => intents.push(intent),
    });

    controller.begin({ x: 3, y: 5 }, 'bottom-right');
    controller.end({ x: 7, y: 13 });

    expect(intents).toEqual([
      { type: 'resize', itemIds: ['a'], rects: [{ id: 'a', x: 1, y: 1, width: 5, height: 4 }] },
    ]);
  });
});
