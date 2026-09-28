import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import type {
  ChessBoard as ChessBoardComponent,
  OpeningBook as OpeningBookComponent,
} from './public';
import { chessBoardMeta } from './meta';
import { createBoardSquares } from './utils/createBoardSquares';
import { createChessBoardColorScheme } from './utils/createChessBoardColorScheme';
import { getSquareFile } from './utils/getSquareFile';
import { getSquareRank } from './utils/getSquareRank';
import { isLightSquare } from './utils/isLightSquare';

const webDistRoot = join(import.meta.dir, '../../../web-dist');
const load = (path: string) => import(pathToFileURL(join(webDistRoot, path)).href);

describe('Chess presentation', () => {
  test('keeps square order and theme-derived presentation independent of chess rules', () => {
    expect(createBoardSquares('white').at(0)).toBe('a8');
    expect(createBoardSquares('black').at(0)).toBe('h1');
    expect(getSquareFile('e4')).toBe('e');
    expect(getSquareRank('e4')).toBe('4');
    expect(isLightSquare('a1')).toBe(false);
    expect(typeof createChessBoardColorScheme).toBe('function');
  });

  test('preserves FEN and validated-move authoring metadata', () => {
    expect(chessBoardMeta.props.fen.type).toBe('string');
    expect(chessBoardMeta.props.validateMoves.default).toBe(true);
    expect(chessBoardMeta.events.legalMove.payloadFields.map((field) => field.path)).toEqual([
      'from',
      'to',
      'fen',
      'san',
      'lan',
      'promotion',
    ]);
    expect(chessBoardMeta.events.invalidMove.payloadFields.map((field) => field.path)).toEqual([
      'from',
      'to',
      'promotion',
    ]);
  });

  test('renders custom React nodes, square IDs, and opening metadata through independent artifacts', async () => {
    const { ChessBoard } = (await load('components/chess-board/index.js')) as {
      ChessBoard: typeof ChessBoardComponent;
    };
    const { OpeningBook } = (await load('components/opening-book/index.js')) as {
      OpeningBook: typeof OpeningBookComponent;
    };
    const markup = renderToStaticMarkup(
      <>
        <ChessBoard
          colorScheme={{ selectedSquare: '#123456', legalTarget: '#234567' }}
          legalTargets={['e4']}
          pieces={[{ color: 'white', piece: 'p', square: 'e2' }]}
          renderPiece={() => <div data-testid="custom-piece" />}
          selectedSquare="e2"
          showCoordinates
          testID="board"
        />
        <OpeningBook
          moves={[
            {
              san: 'Nf3',
              eco: 'A04',
              name: 'Reti Opening',
              games: 42,
              whiteWinRate: 0.52,
              drawRate: 0.2,
              blackWinRate: 0.28,
            },
          ]}
          testID="book"
        />
      </>,
    );
    const browser = new Window();
    browser.document.body.innerHTML = markup;
    expect(browser.document.querySelectorAll('[data-testid^="board-square-"]')).toHaveLength(64);
    expect(
      browser.document.querySelector('[data-testid="board-square-e2"]')?.textContent,
    ).toContain('e2');
    expect(
      browser.document.querySelector('[data-testid="custom-piece"]')?.parentElement?.className,
    ).toContain('css-view');
    expect(
      browser.document.querySelector('[data-testid="board-square-e2"]')?.getAttribute('style'),
    ).toContain('background-color:rgba(18,52,86,1.00)');
    expect(
      browser.document.querySelector('[data-testid="board-square-e4"]')?.getAttribute('style'),
    ).toContain('background-color:rgba(35,69,103,1.00)');
    expect(browser.document.querySelector('[data-testid="book-move-Nf3"]')?.textContent).toContain(
      'A04 · Reti Opening · 42 games',
    );
    expect(browser.document.querySelector('[data-testid="book-move-Nf3"]')?.textContent).toContain(
      'W 52% D 20% B 28%',
    );
    browser.close();
  });

  test('preserves FEN-backed pieces, legal targets, and legal/invalid move callbacks', async () => {
    const { ChessBoard } = (await load('components/chess-board/index.js')) as {
      ChessBoard: typeof ChessBoardComponent;
    };
    const browser = new Window();
    const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
    const previous = keys.map(
      (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
    );
    Object.assign(globalThis, {
      window: browser,
      document: browser.document,
      Node: browser.Node,
      navigator: browser.navigator,
      IS_REACT_ACT_ENVIRONMENT: true,
    });
    const host = document.createElement('div');
    document.body.appendChild(host);
    const legal: string[] = [];
    const invalid: string[] = [];
    const root = createRoot(host);

    try {
      act(() =>
        root.render(
          <ChessBoard
            fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            onInvalidMove={(move) => invalid.push(`${move.from}-${move.to}`)}
            onLegalMove={(move) => legal.push(`${move.lan}:${move.san}`)}
            selectedSquare="e2"
            showCoordinates
            testID="fen-board"
          />,
        ),
      );

      expect(host.querySelector('[data-testid="fen-board-square-e1"]')?.textContent).toContain('♔');
      expect(
        host.querySelector('[data-testid="fen-board-square-e4"]')?.getAttribute('style'),
      ).toContain('background-color');

      act(() => {
        host
          .querySelector('[data-testid="fen-board-square-e4"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      });
      expect(legal).toEqual(['e2e4:e4']);

      act(() => {
        host
          .querySelector('[data-testid="fen-board-square-e5"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      });
      expect(invalid).toEqual(['e2-e5']);
    } finally {
      act(() => root.unmount());
      browser.close();
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else Reflect.deleteProperty(globalThis, key);
      }
    }
  });

  test('emits only caller-owned intents in active mode and suppresses them in passive mode', async () => {
    const { ChessBoard } = (await load('components/chess-board/index.js')) as {
      ChessBoard: typeof ChessBoardComponent;
    };
    const { OpeningBook } = (await load('components/opening-book/index.js')) as {
      OpeningBook: typeof OpeningBookComponent;
    };
    const browser = new Window();
    const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
    const previous = keys.map(
      (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
    );
    Object.assign(globalThis, {
      window: browser,
      document: browser.document,
      Node: browser.Node,
      navigator: browser.navigator,
      IS_REACT_ACT_ENVIRONMENT: true,
    });
    const host = document.createElement('div');
    document.body.appendChild(host);
    const squares: string[] = [];
    const moves: string[] = [];
    const book: string[] = [];
    const root = createRoot(host);
    const render = (interactionPolicy: 'active' | 'passive') => (
      <>
        <ChessBoard
          interactionPolicy={interactionPolicy}
          selectedSquare="e2"
          testID="board"
          onSquarePress={(square) => squares.push(square)}
          onMoveAttempt={(move) => moves.push(`${move.from}-${move.to}`)}
        />
        <OpeningBook
          interactionPolicy={interactionPolicy}
          moves={[{ san: 'e4' }]}
          onMovePress={(move) => book.push(move.san)}
          testID="book"
        />
      </>
    );
    try {
      act(() => root.render(render('passive')));
      act(() => {
        host
          .querySelector('[data-testid="board-square-e4"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
        host
          .querySelector('[data-testid="book-move-e4"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      });
      expect([squares, moves, book]).toEqual([[], [], []]);
      act(() => root.render(render('active')));
      act(() => {
        host
          .querySelector('[data-testid="board-square-e4"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
        host
          .querySelector('[data-testid="book-move-e4"]')
          ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      });
      expect(squares).toEqual(['e4']);
      expect(moves).toEqual(['e2-e4']);
      expect(book).toEqual(['e4']);
    } finally {
      act(() => root.unmount());
      browser.close();
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else Reflect.deleteProperty(globalThis, key);
      }
    }
  });
});
