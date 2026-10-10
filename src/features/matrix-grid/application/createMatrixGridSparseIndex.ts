import type { GridMatrixCell, GridMatrixLayout } from '@ankhorage/grid-view';

/*** Build a geometry-independent lookup for sparse matrix navigation, selection, and focus recovery. */
export function createMatrixGridSparseIndex(
  layout: GridMatrixLayout,
  cells: readonly GridMatrixCell[],
): MatrixGridSparseIndex {
  const rowIndexes = new Map(layout.rows.map((row, index) => [row.id, index]));
  const columnIndexes = new Map(layout.columns.map((column, index) => [column.id, index]));
  const entries = cells.map((cell) => createSparseEntry(cell, rowIndexes, columnIndexes));
  const entriesByRow = groupEntries(entries, 'columnIndex');
  const entriesByColumn = groupEntries(entries, 'rowIndex');
  const orderedEntries = [...entries].sort(compareRowThenColumn);

  return {
    cellById: new Map(entries.map((entry) => [entry.id, entry.cell])),
    entries,
    entriesByColumn,
    entriesByRow,
    firstId: orderedEntries.at(0)?.id ?? null,
    positionById: new Map(entries.map((entry) => [entry.id, entry])),
  };
}

/*** Resolve validated matrix coordinates once without materializing every cell rectangle. */
function createSparseEntry(
  cell: GridMatrixCell,
  rowIndexes: ReadonlyMap<string, number>,
  columnIndexes: ReadonlyMap<string, number>,
): MatrixGridSparseIndexEntry {
  const rowIndex = rowIndexes.get(cell.rowId);
  const columnIndex = columnIndexes.get(cell.columnId);
  if (rowIndex === undefined || columnIndex === undefined) {
    throw new Error(`Matrix cell ${cell.id} references an unknown row or column.`);
  }
  return { cell, columnIndex, id: cell.id, rowIndex };
}

/*** Group and sort directional neighbours so arrow navigation is logarithmic within one axis. */
function groupEntries(
  entries: readonly MatrixGridSparseIndexEntry[],
  axis: 'columnIndex' | 'rowIndex',
): ReadonlyMap<number, readonly MatrixGridSparseIndexEntry[]> {
  const groups = new Map<number, MatrixGridSparseIndexEntry[]>();
  for (const entry of entries) {
    const groupKey = axis === 'columnIndex' ? entry.rowIndex : entry.columnIndex;
    const group = groups.get(groupKey) ?? [];
    group.push(entry);
    groups.set(groupKey, group);
  }
  return new Map(
    [...groups].map(([key, group]) => [
      key,
      group.sort((left, right) => compareAxisThenId(left, right, axis)),
    ]),
  );
}

/*** Keep the initial roving target deterministic even when sparse input arrives in arbitrary order. */
function compareRowThenColumn(
  left: MatrixGridSparseIndexEntry,
  right: MatrixGridSparseIndexEntry,
): number {
  return (
    left.rowIndex - right.rowIndex ||
    left.columnIndex - right.columnIndex ||
    left.id.localeCompare(right.id)
  );
}

/*** Sort a row or column by its navigated coordinate and stable identity. */
function compareAxisThenId(
  left: MatrixGridSparseIndexEntry,
  right: MatrixGridSparseIndexEntry,
  axis: 'columnIndex' | 'rowIndex',
): number {
  return (
    getAxisCoordinate(left, axis) - getAxisCoordinate(right, axis) ||
    left.id.localeCompare(right.id)
  );
}

/*** Read a selected coordinate without dynamically indexing an object. */
function getAxisCoordinate(
  entry: MatrixGridSparseIndexEntry,
  axis: 'columnIndex' | 'rowIndex',
): number {
  return axis === 'columnIndex' ? entry.columnIndex : entry.rowIndex;
}

export type MatrixGridSparseIndex = Readonly<{
  cellById: ReadonlyMap<string, GridMatrixCell>;
  entries: readonly MatrixGridSparseIndexEntry[];
  entriesByColumn: ReadonlyMap<number, readonly MatrixGridSparseIndexEntry[]>;
  entriesByRow: ReadonlyMap<number, readonly MatrixGridSparseIndexEntry[]>;
  firstId: string | null;
  positionById: ReadonlyMap<string, MatrixGridSparseIndexEntry>;
}>;

export type MatrixGridSparseIndexEntry = Readonly<{
  cell: GridMatrixCell;
  columnIndex: number;
  id: string;
  rowIndex: number;
}>;
