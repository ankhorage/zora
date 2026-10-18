import { applySelectionIntent, type SelectionIntent } from '@ankhorage/utility/selection';

import type { SelectionMode } from '../../../types/selection';

type MatrixGridSelectionIntent = SelectionIntent | 'range';

/*** Apply ZORA's canonical selection intent while retaining the configured selection mode. */
export function resolveMatrixGridSelection(
  cells: readonly MatrixGridSelectionCell[],
  selectedIds: readonly string[],
  cellId: string,
  anchorId: string | null,
  intent: MatrixGridSelectionIntent,
  mode: SelectionMode,
  protectedCellIds: ReadonlySet<string>,
): readonly string[] {
  if (protectedCellIds.has(cellId)) return selectedIds;
  if (mode === 'single') return applySelectionIntent(selectedIds, cellId, 'replace');
  if (intent !== 'range') return applySelectionIntent(selectedIds, cellId, intent);

  const anchor = cells.find((cell) => cell.id === anchorId);
  const target = cells.find((cell) => cell.id === cellId);
  if (!anchor || !target) return applySelectionIntent(selectedIds, cellId, 'replace');

  return cells
    .filter(
      (cell) =>
        !protectedCellIds.has(cell.id) &&
        cell.rowIndex >= Math.min(anchor.rowIndex, target.rowIndex) &&
        cell.rowIndex <= Math.max(anchor.rowIndex, target.rowIndex) &&
        cell.columnIndex >= Math.min(anchor.columnIndex, target.columnIndex) &&
        cell.columnIndex <= Math.max(anchor.columnIndex, target.columnIndex),
    )
    .map((cell) => cell.id);
}

type MatrixGridSelectionCell = Readonly<{
  columnIndex: number;
  id: string;
  rowIndex: number;
}>;
