import type { ChessBoardOrientation, ChessSquareId } from '../../../types/chess';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

/*** Orders the 64 displayed squares for the selected player orientation. */
export function createBoardSquares(orientation: ChessBoardOrientation): readonly ChessSquareId[] {
  const displayedRanks = orientation === 'white' ? [...ranks].reverse() : [...ranks];
  const displayedFiles = orientation === 'white' ? [...files] : [...files].reverse();
  return displayedRanks.flatMap((rank) =>
    displayedFiles.map((file): ChessSquareId => `${file}${rank}`),
  );
}
