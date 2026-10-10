import { getVisibleGridItems } from '@ankhorage/grid-view';
import { describe, expect, test } from 'bun:test';

import { sortSpatialGridItems } from './sortSpatialGridItems';

describe('SpatialGrid presentation', () => {
  test('preserves free world rectangles and establishes deterministic overlap hit order', () => {
    const ordered = sortSpatialGridItems([
      { height: 40, id: 'middle', width: 40, x: 24, y: 18 },
      { height: 30, id: 'back', width: 30, x: 16, y: 12, zIndex: -1 },
      { height: 20, id: 'front', width: 20, x: 24, y: 18, zIndex: 2 },
      { height: 10, id: 'front-later', width: 10, x: 24, y: 18, zIndex: 2 },
    ]);

    expect(ordered.map((item) => item.id)).toEqual(['back', 'middle', 'front', 'front-later']);
    expect(ordered[1]).toMatchObject({ height: 40, width: 40, x: 24, y: 18 });
  });

  test('keeps a 10k free-placement catalogue bounded to the viewport subset', () => {
    const items = sortSpatialGridItems(
      Array.from({ length: 10000 }, (_, index) => ({
        height: 20,
        id: `item-${index}`,
        width: 20,
        x: (index % 100) * 100,
        y: Math.floor(index / 100) * 100,
      })),
    );

    const visible = getVisibleGridItems(items, {
      height: 160,
      offsetX: 0,
      offsetY: 0,
      pixelsPerUnitX: 1,
      pixelsPerUnitY: 1,
      width: 160,
    });

    expect(visible).toHaveLength(4);
    expect(visible.map((item) => item.id)).toEqual(['item-0', 'item-1', 'item-100', 'item-101']);
  });
});
