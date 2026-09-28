import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  ChessBoardColorOverrides,
  ChessBoardProps,
  ChessPieceState,
  ChessSquareId,
} from '../../../../types/chess';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createChessBoardSquares, isLightChessSquare } from '../../utils/chessPresentation';

const symbols = new Map<string, string>([
  ['white:p', '♙'],
  ['white:n', '♘'],
  ['white:b', '♗'],
  ['white:r', '♖'],
  ['white:q', '♕'],
  ['white:k', '♔'],
  ['black:p', '♟'],
  ['black:n', '♞'],
  ['black:b', '♝'],
  ['black:r', '♜'],
  ['black:q', '♛'],
  ['black:k', '♚'],
]);

/*** Renders caller-owned chess presentation state without chess rule execution. */
export const ChessBoard = withZoraThemeScope(ChessBoardInner);

function useChessColors(overrides: ChessBoardColorOverrides = {}) {
  const { theme } = useZoraTheme();
  return {
    lightSquare: theme.semantics.neutral.surface,
    darkSquare: theme.semantics.action.primary.softBg,
    lightSquareText: theme.semantics.content.default,
    darkSquareText: theme.semantics.content.default,
    selectedSquare: theme.semantics.warning.softBg,
    legalTarget: theme.semantics.action.primary.base,
    lastMoveFrom: theme.semantics.warning.softBg,
    lastMoveTo: theme.semantics.warning.softBg,
    border: theme.semantics.neutral.border,
    coordinateText: theme.semantics.content.muted,
    lightPiece: theme.semantics.content.default,
    darkPiece: theme.semantics.content.default,
    ...overrides,
  };
}

function ChessBoardInner({
  pieces = [],
  orientation = 'white',
  selectedSquare = null,
  legalTargets = [],
  lastMove = null,
  disabled = false,
  showCoordinates = true,
  colorScheme,
  onSquarePress,
  onMoveAttempt,
  renderPiece,
  testID,
}: ChessBoardProps) {
  const colors = useChessColors(colorScheme);
  const squares = createChessBoardSquares(orientation);
  const piecesBySquare = new Map<ChessSquareId, ChessPieceState>(
    pieces.map((piece) => [piece.square, piece]),
  );
  const legalTargetSet = new Set(legalTargets);
  const pressSquare = (square: ChessSquareId) => {
    if (disabled) return;
    onSquarePress?.(square);
    if (selectedSquare !== null && legalTargetSet.has(square))
      onMoveAttempt?.({ from: selectedSquare, to: square });
  };
  return (
    <View
      accessibilityLabel="Chess board"
      style={[styles.board, { borderColor: colors.border, opacity: disabled ? 0.56 : 1 }]}
      testID={testID}
    >
      {squares.map((square) => {
        const piece = piecesBySquare.get(square);
        const light = isLightChessSquare(square);
        const isTarget = legalTargetSet.has(square);
        const isLastMove = lastMove?.from === square || lastMove?.to === square;
        const backgroundColor =
          selectedSquare === square
            ? colors.selectedSquare
            : isLastMove
              ? lastMove.to === square
                ? colors.lastMoveTo
                : colors.lastMoveFrom
              : light
                ? colors.lightSquare
                : colors.darkSquare;
        const pieceContent =
          piece === undefined
            ? null
            : (renderPiece?.({
                color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece,
                piece: piece.piece,
                square,
              }) ??
              symbols.get(`${piece.color}:${piece.piece.toLowerCase()}`) ??
              piece.piece);
        return (
          <Pressable
            accessibilityLabel={square}
            accessibilityRole="button"
            disabled={disabled}
            key={square}
            onPress={() => pressSquare(square)}
            style={[styles.square, { backgroundColor }]}
          >
            {showCoordinates &&
            (square.startsWith(orientation === 'white' ? 'a' : 'h') ||
              square.endsWith(orientation === 'white' ? '1' : '8')) ? (
              <Text style={[styles.coordinate, { color: colors.coordinateText }]}>
                {square.startsWith(orientation === 'white' ? 'a' : 'h') ? square[1] : square[0]}
              </Text>
            ) : null}
            {isTarget ? (
              <View
                pointerEvents="none"
                style={[styles.target, { backgroundColor: colors.legalTarget }]}
              />
            ) : null}
            {piece === undefined ? null : (
              <Text
                style={[
                  styles.piece,
                  { color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece },
                ]}
              >
                {pieceContent}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { borderWidth: 1, flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' },
  coordinate: { fontSize: 10, left: 3, position: 'absolute', top: 2 },
  piece: { fontSize: 30, lineHeight: 34 },
  square: {
    alignItems: 'center',
    aspectRatio: 1,
    flexBasis: '12.5%',
    justifyContent: 'center',
    position: 'relative',
  },
  target: { borderRadius: 99, height: 10, position: 'absolute', width: 10 },
});
