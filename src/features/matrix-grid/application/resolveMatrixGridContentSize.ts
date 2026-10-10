import {
  getMatrixCellPlacement,
  getVisibleMatrixCells,
  type GridMatrixLayout,
} from '@ankhorage/grid-view';

/*** Resolve total sparse-matrix world extents without expanding its logical cells. */
export function resolveMatrixGridContentSize(layout: GridMatrixLayout) {
  const finalRow = layout.rows.at(-1);
  const finalColumn = layout.columns.at(-1);
  if (!finalRow || !finalColumn) {
    getVisibleMatrixCells(layout, [], {
      height: 1,
      offsetX: 0,
      offsetY: 0,
      pixelsPerUnitX: 1,
      pixelsPerUnitY: 1,
      width: 1,
    });
    return { height: 0, width: 0 };
  }
  const finalCell = getMatrixCellPlacement(layout, {
    id: 'matrix-grid-content-boundary',
    rowId: finalRow.id,
    columnId: finalColumn.id,
  });
  return { height: finalCell.y + finalCell.height, width: finalCell.x + finalCell.width };
}
