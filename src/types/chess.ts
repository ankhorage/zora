import type React from 'react';

import type { ZoraBaseProps } from './base';

export type ChessBoardOrientation = 'white' | 'black';
export type ChessPieceCode = string;
export type ChessSquareId =
  `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
export type ChessPromotionPiece = 'q' | 'r' | 'b' | 'n';

export interface ChessMoveAttempt {
  readonly from: ChessSquareId;
  readonly to: ChessSquareId;
  readonly promotion?: ChessPromotionPiece;
}

export interface ChessPieceState {
  readonly color: 'black' | 'white';
  readonly piece: ChessPieceCode;
  readonly square: ChessSquareId;
}

export interface ChessPieceRenderContext {
  readonly color: string;
  readonly piece: ChessPieceCode;
  readonly square: ChessSquareId;
}

export type ChessPieceRenderer = (context: ChessPieceRenderContext) => React.ReactNode;

export interface ChessBoardColorScheme {
  readonly lightSquare: string;
  readonly darkSquare: string;
  readonly lightSquareText: string;
  readonly darkSquareText: string;
  readonly selectedSquare: string;
  readonly legalTarget: string;
  readonly lastMoveFrom: string;
  readonly lastMoveTo: string;
  readonly border: string;
  readonly coordinateText: string;
  readonly lightPiece: string;
  readonly darkPiece: string;
}

export type ChessBoardColorOverrides = Partial<ChessBoardColorScheme>;

export interface OpeningBookColorScheme {
  readonly border: string;
  readonly surface: string;
  readonly surfaceHover: string;
  readonly selectedSurface: string;
  readonly titleText: string;
  readonly primaryText: string;
  readonly secondaryText: string;
  readonly metricSurface: string;
}
export type OpeningBookColorOverrides = Partial<OpeningBookColorScheme>;

export interface ChessBoardProps extends ZoraBaseProps {
  readonly pieces?: readonly ChessPieceState[];
  readonly orientation?: ChessBoardOrientation;
  readonly selectedSquare?: ChessSquareId | null;
  readonly legalTargets?: readonly ChessSquareId[];
  readonly lastMove?: ChessMoveAttempt | null;
  readonly disabled?: boolean;
  readonly showCoordinates?: boolean;
  readonly colorScheme?: ChessBoardColorOverrides;
  readonly onSquarePress?: (square: ChessSquareId) => void;
  readonly onMoveAttempt?: (move: ChessMoveAttempt) => void;
  readonly renderPiece?: ChessPieceRenderer;
}

export interface OpeningBookMove {
  readonly san: string;
  readonly uci?: string;
  readonly fen?: string;
  readonly name?: string;
  readonly eco?: string;
  readonly games?: number;
  readonly whiteWinRate?: number;
  readonly drawRate?: number;
  readonly blackWinRate?: number;
}

export interface OpeningBookProps extends ZoraBaseProps {
  readonly moves?: readonly OpeningBookMove[];
  readonly title?: string;
  readonly loading?: boolean;
  readonly errorText?: string;
  readonly emptyText?: string;
  readonly selectedMove?: string | null;
  readonly colorScheme?: OpeningBookColorOverrides;
  readonly onMovePress?: (move: OpeningBookMove) => void;
}
