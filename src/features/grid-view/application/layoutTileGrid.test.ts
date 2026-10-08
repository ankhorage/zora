import { describe, expect, test } from 'bun:test';

import { layoutTileGrid } from './layoutTileGrid';

describe('TileGrid presentation', () => {
  test('uses a responsive count of columns and stable item IDs', () => {
    const items = Array.from({ length: 10000 }, (_, index) => ({ id: String(index) }));
    const small = layoutTileGrid(items, 270, 120, 10);
    const large = layoutTileGrid(items, 530, 120, 10);
    expect(small.columns).toBe(2);
    expect(large.columns).toBe(4);
    expect(small.items[2]).toEqual({ id: '2', x: 0, y: 130, width: 120, height: 120 });
    expect(small.items[9999]?.id).toBe('9999');
  });

  test('zoom affects column count without changing stable item identity', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    expect(layoutTileGrid(items, 500, 100, 10, 2).columns).toBe(2);
    expect(layoutTileGrid(items, 500, 100, 10, 1).columns).toBe(4);
  });
});
