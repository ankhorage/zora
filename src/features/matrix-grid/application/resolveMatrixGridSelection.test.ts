import { describe, expect, test } from 'bun:test';

import { resolveMatrixGridSelection } from './resolveMatrixGridSelection';

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
    columnId: 'b',
    columnIndex: 1,
    height: 1,
    id: 'b1',
    rowId: '1',
    rowIndex: 0,
    width: 1,
    x: 1,
    y: 0,
  },
  {
    columnId: 'a',
    columnIndex: 0,
    height: 1,
    id: 'a2',
    rowId: '2',
    rowIndex: 1,
    width: 1,
    x: 0,
    y: 1,
  },
  {
    columnId: 'b',
    columnIndex: 1,
    height: 1,
    id: 'b2',
    rowId: '2',
    rowIndex: 1,
    width: 1,
    x: 1,
    y: 1,
  },
] as const;

describe('resolveMatrixGridSelection', () => {
  test('preserves the canonical single and multi selection intent rules', () => {
    expect(resolveMatrixGridSelection(cells, ['a1'], 'b1', 'a1', 'toggle', 'single')).toEqual([
      'b1',
    ]);
    expect(resolveMatrixGridSelection(cells, ['a1'], 'b1', 'a1', 'toggle', 'multi')).toEqual([
      'a1',
      'b1',
    ]);
  });

  test('uses the selection contract for a sparse rectangular shift range', () => {
    expect(resolveMatrixGridSelection(cells, ['a1'], 'b2', 'a1', 'range', 'multi')).toEqual([
      'a1',
      'b1',
      'a2',
      'b2',
    ]);
  });
});
