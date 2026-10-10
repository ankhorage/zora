import type { GridMatrixLayout } from '@ankhorage/grid-view';

/*** Resolve total sparse-matrix world extents without expanding its logical cells. */
export function resolveMatrixGridContentSize(layout: GridMatrixLayout) {
  return {
    height: layout.rows.reduce((total, row) => total + row.size, 0),
    width: layout.columns.reduce((total, column) => total + column.size, 0),
  };
}
