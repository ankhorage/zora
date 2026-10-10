import type { GridMatrixCellPlacement } from '@ankhorage/grid-view';

/*** Resolve arrow-key focus among existing sparse cells without inventing placeholder geometry. */
export function getMatrixGridNextFocusId(
  cells: readonly GridMatrixCellPlacement[],
  currentId: string | null,
  key: string,
): string | null {
  const current = cells.find((cell) => cell.id === currentId);
  if (!current) return cells.at(0)?.id ?? null;

  const candidate = resolveDirectionalCandidate(cells, current, key);
  return candidate?.id ?? current.id;
}

/*** Find the closest existing sparse cell along the requested matrix axis. */
function resolveDirectionalCandidate(
  cells: readonly GridMatrixCellPlacement[],
  current: GridMatrixCellPlacement,
  key: string,
): GridMatrixCellPlacement | undefined {
  switch (key) {
    case 'ArrowLeft':
      return cells
        .filter(
          (cell) => cell.rowIndex === current.rowIndex && cell.columnIndex < current.columnIndex,
        )
        .at(-1);
    case 'ArrowRight':
      return cells.find(
        (cell) => cell.rowIndex === current.rowIndex && cell.columnIndex > current.columnIndex,
      );
    case 'ArrowUp':
      return cells
        .filter(
          (cell) => cell.columnIndex === current.columnIndex && cell.rowIndex < current.rowIndex,
        )
        .at(-1);
    case 'ArrowDown':
      return cells.find(
        (cell) => cell.columnIndex === current.columnIndex && cell.rowIndex > current.rowIndex,
      );
    default:
      return undefined;
  }
}
