import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  ChessBoardProps,
  ChessMoveAttempt,
  ChessPieceState,
  ChessSquareId,
} from '../../../../types/chess';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createBoardSquares } from '../../utils/createBoardSquares';
import { createChessBoardColorScheme } from '../../utils/createChessBoardColorScheme';
import { getLegalTargets, readChessPieces, tryMove } from '../../utils/chessEngine';
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

/*** Renders caller-owned or FEN-backed chess state with optional legal-move validation. */
export const ChessBoard = withZoraThemeScope(ChessBoardInner);

/*** Renders the current presentation state and delegates FEN validation to the core chess engine. */
function ChessBoardInner({
  fen,
  pieces,
  orientation = 'white',
  selectedSquare = null,
  legalTargets,
  lastMove = null,
  disabled = false,
  showCoordinates = false,
  validateMoves = true,
  colorScheme,
  onSquarePress,
  onMoveAttempt,
  onLegalMove,
  onInvalidMove,
  renderPiece,
  interactionPolicy,
  testID,
}: ChessBoardProps) {
  const { theme } = useZoraTheme();
  const colors = createChessBoardColorScheme(theme, colorScheme);
  const squares = createBoardSquares(orientation);
  const piecesBySquare =
    pieces === undefined
      ? fen === undefined
        ? new Map<ChessSquareId, ChessPieceState>()
        : new Map(readChessPieces(fen))
      : new Map<ChessSquareId, ChessPieceState>(pieces.map((piece) => [piece.square, piece]));
  const resolvedLegalTargets =
    legalTargets ??
    (fen !== undefined && selectedSquare !== null ? getLegalTargets(fen, selectedSquare) : []);
  const legalTargetSet = new Set(resolvedLegalTargets);
  const pressSquare = (square: ChessSquareId) => {
    if (disabled || interactionPolicy === 'passive') return;
    onSquarePress?.(square);
    if (selectedSquare === null || selectedSquare === square) return;

    const attempt: ChessMoveAttempt = { from: selectedSquare, to: square };
    onMoveAttempt?.(attempt);
    if (!validateMoves || fen === undefined) return;

    const result = tryMove(fen, attempt);
    if (result) onLegalMove?.(result);
    else onInvalidMove?.(attempt);
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
