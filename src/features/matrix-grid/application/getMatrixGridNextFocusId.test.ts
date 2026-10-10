import { describe, expect, test } from 'bun:test';

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

describe('getMatrixGridNextFocusId', () => {
  test('moves over sparse rows and columns without materializing missing cells', () => {
    expect(getMatrixGridNextFocusId(cells, 'a1', 'ArrowRight')).toBe('c1');
    expect(getMatrixGridNextFocusId(cells, 'c3', 'ArrowLeft')).toBe('a3');
    expect(getMatrixGridNextFocusId(cells, 'a1', 'ArrowDown')).toBe('a3');
    expect(getMatrixGridNextFocusId(cells, 'c3', 'ArrowUp')).toBe('c1');
  });

  test('retains focus at a sparse edge and initializes from the first real cell', () => {
    expect(getMatrixGridNextFocusId(cells, 'a1', 'ArrowLeft')).toBe('a1');
    expect(getMatrixGridNextFocusId(cells, null, 'ArrowRight')).toBe('a1');
    expect(getMatrixGridNextFocusId([], null, 'ArrowRight')).toBeNull();
  });
});
