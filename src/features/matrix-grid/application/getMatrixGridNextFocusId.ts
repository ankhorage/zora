import type {
  MatrixGridSparseIndex,
  MatrixGridSparseIndexEntry,
} from './createMatrixGridSparseIndex';

/*** Resolve arrow-key focus among existing sparse cells without inventing placeholder geometry. */
export function getMatrixGridNextFocusId(
  index: MatrixGridSparseIndex,
  currentId: string | null,
  key: string,
): string | null {
  const current = currentId === null ? undefined : index.positionById.get(currentId);
  if (!current) return index.firstId;

  return resolveDirectionalCandidate(index, current, key)?.id ?? current.id;
}

/*** Find the closest existing sparse cell along the requested matrix axis. */
function resolveDirectionalCandidate(
  index: MatrixGridSparseIndex,
  current: MatrixGridSparseIndexEntry,
  key: string,
): MatrixGridSparseIndexEntry | undefined {
  switch (key) {
    case 'ArrowLeft':
      return findDirectionalNeighbour(
        index.entriesByRow.get(current.rowIndex),
        current,
        'columnIndex',
        -1,
      );
    case 'ArrowRight':
      return findDirectionalNeighbour(
        index.entriesByRow.get(current.rowIndex),
        current,
        'columnIndex',
        1,
      );
    case 'ArrowUp':
      return findDirectionalNeighbour(
        index.entriesByColumn.get(current.columnIndex),
        current,
        'rowIndex',
        -1,
      );
    case 'ArrowDown':
      return findDirectionalNeighbour(
        index.entriesByColumn.get(current.columnIndex),
        current,
        'rowIndex',
        1,
      );
    default:
      return undefined;
  }
}

/*** Read the nearest strictly directional neighbour from a pre-sorted sparse axis. */
function findDirectionalNeighbour(
  entries: readonly MatrixGridSparseIndexEntry[] | undefined,
  current: MatrixGridSparseIndexEntry,
  axis: 'columnIndex' | 'rowIndex',
  direction: -1 | 1,
): MatrixGridSparseIndexEntry | undefined {
  if (!entries) return undefined;
  const coordinate = getAxisCoordinate(current, axis);
  const insertionIndex = findFirstGreaterOrEqual(entries, coordinate, axis);
  if (direction === -1) return insertionIndex === 0 ? undefined : entries[insertionIndex - 1];
  return entries[findFirstGreater(entries, coordinate, axis)];
}

/*** Locate the first entry strictly after a matrix coordinate in a sorted sparse axis. */
function findFirstGreater(
  entries: readonly MatrixGridSparseIndexEntry[],
  coordinate: number,
  axis: 'columnIndex' | 'rowIndex',
): number {
  let lower = 0;
  let upper = entries.length;
  while (lower < upper) {
    const middle = Math.floor((lower + upper) / 2);
    const entry = entries.at(middle);
    if (entry && getAxisCoordinate(entry, axis) <= coordinate) lower = middle + 1;
    else upper = middle;
  }
  return lower;
}

/*** Locate the first index at or after a matrix coordinate in a sorted sparse axis. */
function findFirstGreaterOrEqual(
  entries: readonly MatrixGridSparseIndexEntry[],
  coordinate: number,
  axis: 'columnIndex' | 'rowIndex',
): number {
  let lower = 0;
  let upper = entries.length;
  while (lower < upper) {
    const middle = Math.floor((lower + upper) / 2);
    const entry = entries.at(middle);
    if (entry && getAxisCoordinate(entry, axis) < coordinate) lower = middle + 1;
    else upper = middle;
  }
  return lower;
}

/*** Read a selected coordinate without dynamically indexing sparse entries. */
function getAxisCoordinate(
  entry: MatrixGridSparseIndexEntry,
  axis: 'columnIndex' | 'rowIndex',
): number {
  return axis === 'columnIndex' ? entry.columnIndex : entry.rowIndex;
}
