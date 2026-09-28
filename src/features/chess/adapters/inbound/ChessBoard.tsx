import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ChessBoardProps, ChessPieceState, ChessSquareId } from '../../../../types/chess';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createBoardSquares } from '../../utils/createBoardSquares';
import { createChessBoardColorScheme } from '../../utils/createChessBoardColorScheme';
import { isLightSquare } from '../../utils/isLightSquare';

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

/*** Renders the current presentation state without executing chess rules. */
function ChessBoardInner({
  pieces = [],
  orientation = 'white',
  selectedSquare = null,
  legalTargets = [],
  lastMove = null,
  disabled = false,
  showCoordinates = false,
  colorScheme,
  onSquarePress,
  onMoveAttempt,
  renderPiece,
  interactionPolicy,
  testID,
}: ChessBoardProps) {
  const { theme } = useZoraTheme();
  const colors = createChessBoardColorScheme(theme, colorScheme);
  const squares = createBoardSquares(orientation);
  const piecesBySquare = new Map<ChessSquareId, ChessPieceState>(
    pieces.map((piece) => [piece.square, piece]),
  );
  const legalTargetSet = new Set(legalTargets);
  const pressSquare = (square: ChessSquareId) => {
    if (disabled || interactionPolicy === 'passive') return;
    onSquarePress?.(square);
    if (selectedSquare !== null && selectedSquare !== square)
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
        const light = isLightSquare(square);
        const isTarget = legalTargetSet.has(square);
        const backgroundColor =
          selectedSquare === square
            ? colors.selectedSquare
            : isTarget
              ? colors.legalTarget
              : lastMove?.from === square
                ? colors.lastMoveFrom
                : lastMove?.to === square
                  ? colors.lastMoveTo
                  : light
                    ? colors.lightSquare
                    : colors.darkSquare;
        const pieceContent =
          piece === undefined
            ? null
            : renderPiece
              ? renderPiece({
                  color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece,
                  piece: piece.piece,
                  square,
                })
              : (symbols.get(`${piece.color}:${piece.piece.toLowerCase()}`) ?? piece.piece);
        return (
          <Pressable
            accessibilityLabel={square}
            accessibilityRole="button"
            disabled={disabled || interactionPolicy === 'passive'}
            key={square}
            onPress={() => pressSquare(square)}
            style={[styles.square, { backgroundColor }]}
            testID={testID ? `${testID}-square-${square}` : undefined}
          >
            {showCoordinates ? (
              <Text
                style={[
                  styles.coordinate,
                  { color: light ? colors.lightSquareText : colors.darkSquareText },
                ]}
              >
                {square}
              </Text>
            ) : null}
            {piece === undefined ? null : (
              <View pointerEvents="none" style={styles.pieceContainer}>
                {renderPiece ? (
                  pieceContent
                ) : (
                  <Text
                    style={[
                      styles.piece,
                      { color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece },
                    ]}
                  >
                    {pieceContent}
                  </Text>
                )}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    width: '100%',
  },
  coordinate: {
    fontSize: 9,
    fontWeight: '600',
    left: 3,
    opacity: 0.72,
    position: 'absolute',
    top: 2,
    zIndex: 2,
  },
  piece: { fontSize: 32, fontWeight: '600', lineHeight: 38 },
  pieceContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  square: {
    alignItems: 'center',
    aspectRatio: 1,
    width: '12.5%',
    justifyContent: 'center',
    position: 'relative',
  },
});
