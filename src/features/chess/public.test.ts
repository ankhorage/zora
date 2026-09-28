import { describe, expect, test } from 'bun:test';

import type { ChessBoardProps, ChessMoveAttempt, OpeningBookProps } from '../..';

describe('Chess public contract', () => {
  test('publishes caller-owned board and opening-book inputs through the package root', () => {
    const move: ChessMoveAttempt = { from: 'e2', to: 'e4' };
    const board: ChessBoardProps = {
      legalTargets: ['e4'],
      pieces: [{ color: 'white', piece: 'p', square: 'e2' }],
      selectedSquare: move.from,
    };
    const book: OpeningBookProps = { moves: [{ san: 'e4', name: 'King pawn game' }] };

    expect(() => JSON.stringify(board)).not.toThrow();
    expect(() => JSON.stringify(book)).not.toThrow();
  });

  test('keeps chess rules and engines outside the presentation component', async () => {
    const source = await Bun.file('src/features/chess/adapters/inbound/ChessBoard.tsx').text();

    expect(source).not.toContain('chess.js');
    expect(source).not.toContain('legalMoves');
    expect(source).toContain('onMoveAttempt');
  });
});
