import type { ChessSquareId } from '../../../types/chess';

const files = 'abcdefgh';

/*** Determines whether a chess square uses the light presentation color. */
export function isLightSquare(square: ChessSquareId): boolean {
  return (files.indexOf(square[0] ?? '') + Number(square[1]) - 1) % 2 === 1;
}
