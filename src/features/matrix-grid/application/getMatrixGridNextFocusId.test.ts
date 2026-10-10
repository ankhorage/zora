import { describe, expect, test } from 'bun:test';

import { createMatrixGridSparseIndex } from './createMatrixGridSparseIndex';
import { getMatrixGridNextFocusId } from './getMatrixGridNextFocusId';

const cells = [
  {
    columnId: 'a',
    columnIndex: 0,
    height: 1,
    id: 'a1',
    rowId: '1',
    rowIndex: 0,
    width: 1,
    x: 0,
    y: 0,
  },
  {
    columnId: 'c',
    columnIndex: 2,
    height: 1,
    id: 'c1',
    rowId: '1',
    rowIndex: 0,
    width: 1,
    x: 2,
    y: 0,
  },
  {
    columnId: 'a',
    columnIndex: 0,
    height: 1,
    id: 'a3',
    rowId: '3',
    rowIndex: 2,
    width: 1,
    x: 0,
    y: 2,
  },
  {
    columnId: 'c',
    columnIndex: 2,
    height: 1,
    id: 'c3',
    rowId: '3',
    rowIndex: 2,
    width: 1,
    x: 2,
    y: 2,
  },
] as const;

const layout = {
  columns: [
    { id: 'a', size: 1 },
    { id: 'b', size: 1 },
    { id: 'c', size: 1 },
  ],
  rows: [
    { id: '1', size: 1 },
    { id: '2', size: 1 },
    { id: '3', size: 1 },
  ],
} as const;

const index = createMatrixGridSparseIndex(layout, cells);

describe('getMatrixGridNextFocusId', () => {
  test('moves over sparse rows and columns without materializing missing cells', () => {
    expect(getMatrixGridNextFocusId(index, 'a1', 'ArrowRight')).toBe('c1');
    expect(getMatrixGridNextFocusId(index, 'c3', 'ArrowLeft')).toBe('a3');
    expect(getMatrixGridNextFocusId(index, 'a1', 'ArrowDown')).toBe('a3');
    expect(getMatrixGridNextFocusId(index, 'c3', 'ArrowUp')).toBe('c1');
  });

  test('retains focus at a sparse edge and initializes from the first real cell', () => {
    expect(getMatrixGridNextFocusId(index, 'a1', 'ArrowLeft')).toBe('a1');
    expect(getMatrixGridNextFocusId(index, null, 'ArrowRight')).toBe('a1');
    expect(
      getMatrixGridNextFocusId(createMatrixGridSparseIndex(layout, []), null, 'ArrowRight'),
    ).toBeNull();
  });

  test('chooses geometric neighbours from an intentionally unsorted sparse input', () => {
    const unsorted = createMatrixGridSparseIndex(layout, [cells[3], cells[1], cells[2], cells[0]]);

    expect(getMatrixGridNextFocusId(unsorted, 'a1', 'ArrowRight')).toBe('c1');
    expect(getMatrixGridNextFocusId(unsorted, 'c3', 'ArrowLeft')).toBe('a3');
    expect(getMatrixGridNextFocusId(unsorted, 'a1', 'ArrowDown')).toBe('a3');
    expect(getMatrixGridNextFocusId(unsorted, 'c3', 'ArrowUp')).toBe('c1');
    expect(getMatrixGridNextFocusId(unsorted, null, 'ArrowRight')).toBe('a1');
  });
});
