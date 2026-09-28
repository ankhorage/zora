import type { ChessSquareId } from '../../../types/chess';

/*** Lists every board square in ascending rank and file order. */
export const chessSquares: readonly ChessSquareId[] = [1, 2, 3, 4, 5, 6, 7, 8].flatMap((rank) =>
  [...'abcdefgh'].map((file) => `${file}${rank}` as ChessSquareId),
);
