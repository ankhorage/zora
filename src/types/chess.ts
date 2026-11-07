import type React from 'react';

import type { ZoraBaseProps } from './base';

export type ChessBoardOrientation = 'white' | 'black';
export type ChessPieceCode = string;

/** A caller-owned cell location in a rectangular chess presentation board. */
export interface ChessBoardCell {
  readonly column: number;
  readonly row: number;
}

/** The bounded presentation dimensions supported by ChessBoard. */
export interface ChessBoardDimensions {
  readonly columns: number;
  readonly rows: number;
}

export interface ChessMoveAttempt {
  readonly from: ChessBoardCell;
  readonly to: ChessBoardCell;
}

export interface ChessPieceState {
  readonly color: 'black' | 'white';
  readonly piece: ChessPieceCode;
  readonly cell: ChessBoardCell;
}

export interface ChessPieceRenderContext {
  readonly color: string;
  readonly piece: ChessPieceCode;
  readonly cell: ChessBoardCell;
  /** Available cell edge length in pixels. */
  readonly size: number;
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
  /** Number of displayed columns, from 2 through 24. */
  readonly columns?: number;
  /** Number of displayed rows, from 2 through 24. */
  readonly rows?: number;
  readonly pieces?: readonly ChessPieceState[];
  readonly orientation?: ChessBoardOrientation;
  readonly selectedCell?: ChessBoardCell | null;
  readonly legalTargets?: readonly ChessBoardCell[];
  readonly lastMove?: ChessMoveAttempt | null;
  readonly disabled?: boolean;
  readonly showCoordinates?: boolean;
  /** Enables explicit editor resize controls when a dimensions callback is supplied. */
  readonly resizable?: boolean;
  readonly colorScheme?: ChessBoardColorOverrides;
  readonly onCellPress?: (cell: ChessBoardCell) => void;
  readonly onMoveAttempt?: (move: ChessMoveAttempt) => void;
  /** Receives a caller-owned resize proposal; ZORA never mutates board dimensions. */
  readonly onDimensionsChange?: (dimensions: ChessBoardDimensions) => void;
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
