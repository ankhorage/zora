import type { ChessBoardCell, ChessBoardOrientation } from '../../../types/chess';

const minimumDimension = 2;
const maximumDimension = 24;

type ChessBoardGridCell = ChessBoardCell & {
  readonly height: 1;
  readonly id: string;
  readonly width: 1;
  readonly x: number;
  readonly y: number;
};

/*** Creates bounded GridView cells whose coordinates represent the requested chess orientation. */
export function createChessBoardCells(
  columns: number,
  rows: number,
  orientation: ChessBoardOrientation,
): readonly ChessBoardGridCell[] {
  validateChessBoardDimensions(columns, rows);

  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, columnIndex) => {
      const column = columnIndex + 1;
      const row = rowIndex + 1;

      return {
        column,
        height: 1 as const,
        id: `${column}:${row}`,
        row,
        width: 1 as const,
        x: orientation === 'white' ? columnIndex : columns - column,
        y: orientation === 'white' ? rows - row : rowIndex,
      };
    }),
  ).flat();
}

/*** Rejects dimensions outside the presentation contract before GridView receives them. */
function validateChessBoardDimensions(columns: number, rows: number): void {
  if (
    ![columns, rows].every(
      (dimension) =>
        Number.isInteger(dimension) &&
        dimension >= minimumDimension &&
        dimension <= maximumDimension,
    )
  ) {
    throw new RangeError(
      `ChessBoard dimensions must be whole numbers from ${minimumDimension} through ${maximumDimension}.`,
    );
  }
}
