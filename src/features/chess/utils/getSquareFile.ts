import type { ChessSquareId } from '../../../types/chess';

/*** Returns the file letter of a chess square. */
export function getSquareFile(square: ChessSquareId): string {
  return square[0] ?? '';
}
