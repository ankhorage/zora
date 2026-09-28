import { Chess, type Move } from 'chess.js';

import type {
  ChessMoveAttempt,
  ChessMoveResult,
  ChessPieceCode,
  ChessPieceState,
  ChessPromotionPiece,
  ChessSquareId,
} from '../../../types/chess';

/*** Create a chess.js position from FEN without leaking invalid-position exceptions. */
function createChess(fen: string): Chess | null {
  try {
    return new Chess(fen);
  } catch {
    return null;
  }
}

/*** Convert a chess.js piece into the public ZORA piece code. */
function toPieceCode(piece: { readonly color: 'b' | 'w'; readonly type: string }): ChessPieceCode {
  return piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
}

/*** Normalize a chess.js promotion marker into the public promotion union. */
function toPromotionPiece(piece: string | undefined): ChessPromotionPiece | undefined {
  return piece === 'q' || piece === 'r' || piece === 'b' || piece === 'n' ? piece : undefined;
}

/*** Convert one successful chess.js move into the public result contract. */
function toMoveResult(move: Move, fen: string): ChessMoveResult {
  return {
    fen,
    from: move.from,
    lan: move.lan,
    promotion: toPromotionPiece(move.promotion),
    san: move.san,
    to: move.to,
  };
}

/*** Read all pieces from a FEN-backed position. Invalid FEN produces an empty position. */
export function readChessPieces(fen: string): ReadonlyMap<ChessSquareId, ChessPieceState> {
  const chess = createChess(fen);
  const pieces = new Map<ChessSquareId, ChessPieceState>();
  if (!chess) return pieces;

  for (const rank of chess.board()) {
    for (const piece of rank) {
      if (!piece) continue;
      pieces.set(piece.square, {
        color: piece.color === 'w' ? 'white' : 'black',
        piece: toPieceCode(piece),
        square: piece.square,
      });
    }
  }
  return pieces;
}

/*** Resolve legal destination squares from one FEN position and source square. */
export function getLegalTargets(fen: string, from: ChessSquareId): readonly ChessSquareId[] {
  const chess = createChess(fen);
  return chess ? chess.moves({ square: from, verbose: true }).map((move) => move.to) : [];
}

/*** Attempt one legal chess move against FEN and return the resulting position/move notation. */
export function tryMove(fen: string, attempt: ChessMoveAttempt): ChessMoveResult | null {
  const chess = createChess(fen);
  if (!chess) return null;

  try {
    const move = chess.move({
      from: attempt.from,
      promotion: attempt.promotion,
      to: attempt.to,
    });
    return toMoveResult(move, chess.fen());
  } catch {
    return null;
  }
}
