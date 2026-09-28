import type { ChessSquareId } from '../../../types/chess';

/*** Returns the rank number of a chess square. */
export function getSquareRank(square: ChessSquareId): string {
  return square[1] ?? '';
}
