import { getMatrixCellPlacement, getVisibleMatrixCells } from '@ankhorage/grid-view';
import { describe, expect, test } from 'bun:test';

describe('MatrixGrid sparse geometry', () => {
  test('culls a 10k sparse cell catalogue in a million-cell logical matrix', () => {
    const layout = {
      columns: Array.from({ length: 1000 }, (_, index) => ({ id: `column-${index}`, size: 20 })),
      rows: Array.from({ length: 1000 }, (_, index) => ({
        id: `row-${index}`,
        size: index % 2 === 0 ? 16 : 24,
      })),
    };
    const cells = Array.from({ length: 10001 }, (_, index) => ({
      columnId: `column-${(index * 37) % 1000}`,
      id: `cell-${index}`,
      rowId: `row-${(index * 91) % 1000}`,
    }));

    const firstCell = cells.at(0);
    if (!firstCell) throw new Error('The sparse test catalogue must contain a first cell.');
    const first = getMatrixCellPlacement(layout, firstCell);
    const visible = getVisibleMatrixCells(layout, cells, {
      height: 120,
      offsetX: first.x,
      offsetY: first.y,
      pixelsPerUnitX: 1,
      pixelsPerUnitY: 1,
      width: 120,
    });

    expect(first).toMatchObject({ id: 'cell-0', width: 20 });
    expect(visible.length).toBeLessThan(cells.length);
    expect(visible.every((cell) => cell.width === 20 && cell.height > 0)).toBe(true);
  });
});
