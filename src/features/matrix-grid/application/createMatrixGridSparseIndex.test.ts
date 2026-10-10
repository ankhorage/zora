import { describe, expect, test } from 'bun:test';

import { createMatrixGridSparseIndex } from './createMatrixGridSparseIndex';
import { getMatrixGridNextFocusId } from './getMatrixGridNextFocusId';

describe('createMatrixGridSparseIndex', () => {
  test('indexes more than 10k sparse cells without creating placement rectangles', () => {
    const layout = {
      columns: Array.from({ length: 1_000 }, (_, index) => ({ id: `column-${index}`, size: 10 })),
      rows: Array.from({ length: 1_000 }, (_, index) => ({ id: `row-${index}`, size: 10 })),
    };
    const cells = layout.rows.flatMap((row) =>
      layout.columns.slice(0, 10).map((column) => ({
        columnId: column.id,
        id: `${row.id}-${column.id}`,
        rowId: row.id,
      })),
    );
    const index = createMatrixGridSparseIndex(layout, [...cells].reverse());

    expect(index.entries).toHaveLength(10_000);
    expect(index.entries[0]).toEqual({
      cell: cells.at(-1),
      columnIndex: 9,
      id: 'row-999-column-9',
      rowIndex: 999,
    });
    expect(getMatrixGridNextFocusId(index, 'row-500-column-5', 'ArrowRight')).toBe(
      'row-500-column-6',
    );
    expect(getMatrixGridNextFocusId(index, 'row-500-column-5', 'ArrowDown')).toBe(
      'row-501-column-5',
    );
  });
});
