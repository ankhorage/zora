import type { ChessBoardOrientation, ChessSquareId } from '../../../types/chess';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

/*** Creates the ordered 64-square grid for a visual chessboard orientation. */
export function createChessBoardSquares(
  orientation: ChessBoardOrientation,
): readonly ChessSquareId[] {
  const displayedRanks = orientation === 'white' ? [...ranks].reverse() : [...ranks];
  const displayedFiles = orientation === 'white' ? [...files] : [...files].reverse();
  return displayedRanks.flatMap((rank) =>
    displayedFiles.map((file) => createChessSquare(file, rank)),
  );
}

function createChessSquare(
  file: (typeof files)[number],
  rank: (typeof ranks)[number],
): ChessSquareId {
  return `${file}${rank}`;
}

/*** Determines whether a chess square uses the light presentation color. */
export function isLightChessSquare(square: ChessSquareId): boolean {
  return (
    (files.indexOf(square[0] as (typeof files)[number]) +
      ranks.indexOf(square[1] as (typeof ranks)[number])) %
      2 ===
    1
  );
}
