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

  test('does not compound controlled move previews or reapply the release endpoint', () => {
    const intents: unknown[] = [];
    const initialItems = [{ id: 'a', x: 40, y: 40, width: 20, height: 20 }];
    const controller = createGridInteractionsController({
      viewport,
      items: initialItems,
      onIntent: (intent) => intents.push(intent),
    });

    controller.begin({ x: 80, y: 160 });
    controller.move({ x: 100, y: 160 });
    controller.update({
      viewport,
      items: [{ id: 'a', x: 50, y: 40, width: 20, height: 20 }],
      onIntent: (intent) => intents.push(intent),
    });
    controller.move({ x: 120, y: 160 });
    controller.update({
      viewport,
      items: [{ id: 'a', x: 60, y: 40, width: 20, height: 20 }],
      onIntent: (intent) => intents.push(intent),
    });
    controller.end({ x: 120, y: 160 });

    expect(intents).toEqual([
      { type: 'move', itemIds: ['a'], rects: [{ id: 'a', x: 50, y: 40, width: 20, height: 20 }] },
      { type: 'move', itemIds: ['a'], rects: [{ id: 'a', x: 60, y: 40, width: 20, height: 20 }] },
    ]);
  });

  test('keeps controlled resize, negative multi-item movement, cancel, and pan non-compounding', () => {
    const resizeIntents: unknown[] = [];
    const resizeController = createGridInteractionsController({
      viewport,
      items: [{ id: 'a', x: 40, y: 40, width: 20, height: 20 }],
      onIntent: (intent) => resizeIntents.push(intent),
    });

    resizeController.begin({ x: 120, y: 240 }, 'bottom-right');
    resizeController.move({ x: 140, y: 280 });
    resizeController.update({
      viewport,
      items: [{ id: 'a', x: 40, y: 40, width: 30, height: 30 }],
      onIntent: (intent) => resizeIntents.push(intent),
    });
    resizeController.move({ x: 160, y: 320 });
    resizeController.update({
      viewport,
      items: [{ id: 'a', x: 40, y: 40, width: 40, height: 40 }],
      onIntent: (intent) => resizeIntents.push(intent),
    });
    resizeController.end({ x: 160, y: 320 });

    const moveIntents: unknown[] = [];
    const moveController = createGridInteractionsController({
      viewport,
      items: [
        { id: 'a', x: 40, y: 40, width: 20, height: 20 },
        { id: 'b', x: 80, y: 40, width: 20, height: 20 },
      ],
      selectedIds: ['a', 'b'],
      onIntent: (intent) => moveIntents.push(intent),
    });

    moveController.begin({ x: 80, y: 160 });
    moveController.move({ x: 60, y: 120 });
    moveController.cancel();
    moveController.end({ x: 40, y: 80 });

    const panIntents: unknown[] = [];
    const panController = createGridInteractionsController({
      viewport,
      items: [],
      onIntent: (intent) => panIntents.push(intent),
    });

    panController.begin({ x: 20, y: 40, spaceKey: true });
    panController.move({ x: 40, y: 80 });
    panController.update({
      viewport: { ...viewport, offsetX: 5, offsetY: 2.5 },
      items: [],
      onIntent: (intent) => panIntents.push(intent),
    });
    panController.move({ x: 60, y: 120 });
    panController.end({ x: 60, y: 120 });

    expect(resizeIntents).toEqual([
      { type: 'resize', itemIds: ['a'], rects: [{ id: 'a', x: 40, y: 40, width: 30, height: 30 }] },
      { type: 'resize', itemIds: ['a'], rects: [{ id: 'a', x: 40, y: 40, width: 40, height: 40 }] },
    ]);
    expect(moveIntents).toEqual([
      {
        type: 'move',
        itemIds: ['a', 'b'],
        rects: [
          { id: 'a', x: 30, y: 30, width: 20, height: 20 },
          { id: 'b', x: 70, y: 30, width: 20, height: 20 },
        ],
      },
    ]);
    expect(panIntents).toEqual([
      {
        type: 'pan',
        itemIds: [],
        viewport: { ...viewport, offsetX: 5, offsetY: 2.5 },
      },
      {
        type: 'pan',
        itemIds: [],
        viewport: { ...viewport, offsetX: 10, offsetY: 5 },
      },
    ]);
  });
});
