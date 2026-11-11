import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { ChessBoard } from '../src/features/chess/public';
import type { ChessBoardCell, ChessMoveAttempt } from '../src/types/chess';

interface ChessAcceptanceState {
  readonly events: readonly string[];
  readonly moves: readonly ChessMoveAttempt[];
  readonly rects: Readonly<Record<string, ChessRect>>;
}

interface ChessRect {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

declare global {
  interface Window {
    chessAcceptance?: {
      read(): ChessAcceptanceState;
      resize(width: number): void;
    };
  }
}

const events: string[] = [];
const moves: ChessMoveAttempt[] = [];

/*** Mount rectangular, caller-controlled boards for native Chromium input acceptance. */
function ChessChromiumAcceptance() {
  const [selectedCell, setSelectedCell] = useState<ChessBoardCell | null>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    window.chessAcceptance = {
      read: () => ({ events, moves, rects: readRects() }),
      resize: setWidth,
    };
    return () => {
      delete window.chessAcceptance;
    };
  }, []);

  const onCellPress = (cell: ChessBoardCell) => {
    events.push(`press:${cell.column}:${cell.row}`);
    setSelectedCell(cell);
  };
  const onMoveAttempt = (move: ChessMoveAttempt) => {
    moves.push(move);
  };

  return (
    <main style={{ display: 'flex', gap: 24, width }}>
      <section style={{ width: '50%' }}>
        <ChessBoard
          columns={3}
          onCellPress={onCellPress}
          onMoveAttempt={onMoveAttempt}
          orientation="white"
          rows={2}
          selectedCell={selectedCell}
          testID="white"
        />
      </section>
      <section style={{ width: '50%' }}>
        <ChessBoard
          columns={3}
          onCellPress={onCellPress}
          orientation="black"
          rows={2}
          testID="black"
        />
      </section>
    </main>
  );
}

/*** Read browser-produced cell rectangles from the native Pressable DOM nodes. */
function readRects(): Record<string, ChessRect> {
  return Object.fromEntries(
    ['white-cell-a2', 'white-cell-b2', 'black-cell-a2', 'black-cell-c1'].flatMap((testId) => {
      const element = document.querySelector(`[data-testid="${testId}"]`);
      if (!(element instanceof HTMLElement)) return [];
      const { height, width, x, y } = element.getBoundingClientRect();
      return [[testId, { height, width, x, y }]];
    }),
  );
}

document.body.style.margin = '20px';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(<ChessChromiumAcceptance />);
