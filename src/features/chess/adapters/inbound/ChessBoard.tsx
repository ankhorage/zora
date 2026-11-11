import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  ChessBoardCell,
  ChessBoardDimensions,
  ChessBoardProps,
  ChessMoveAttempt,
  ChessPieceState,
} from '../../../../types/chess';
import { GridView } from '../../../grid-view/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createChessBoardCellPressHandler } from '../../utils/createChessBoardCellPressHandler';
import { createChessBoardCells } from '../../utils/createChessBoardCells';
import { createChessBoardColorScheme } from '../../utils/createChessBoardColorScheme';

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
const minimumDimension = 2;
const maximumDimension = 24;

/*** Renders a configurable caller-owned chess presentation through the shared GridView surface. */
export const ChessBoard = withZoraThemeScope(ChessBoardInner);

/*** Renders board state and emits caller-owned cell and move intents without applying chess rules. */
function ChessBoardInner({
  columns = 8,
  rows = 8,
  pieces,
  orientation = 'white',
  selectedCell = null,
  legalTargets = [],
  lastMove = null,
  disabled = false,
  showCoordinates = false,
  resizable = false,
  colorScheme,
  onCellPress,
  onMoveAttempt,
  onDimensionsChange,
  renderPiece,
  interactionPolicy,
  testID,
}: ChessBoardProps) {
  const { theme } = useZoraTheme();
  const colors = createChessBoardColorScheme(theme, colorScheme);
  const dimensions = React.useMemo(() => ({ columns, rows }), [columns, rows]);
  const [width, setWidth] = React.useState(0);
  const cells = React.useMemo(
    () => createChessBoardCells(columns, rows, orientation),
    [columns, orientation, rows],
  );
  const piecesByCell = React.useMemo(
    () => new Map((pieces ?? []).map((piece) => [getCellKey(piece.cell), piece])),
    [pieces],
  );
  const cellById = React.useMemo(() => new Map(cells.map((cell) => [cell.id, cell])), [cells]);
  const legalTargetSet = React.useMemo(() => new Set(legalTargets.map(getCellKey)), [legalTargets]);
  const pressCell = createChessBoardCellPressHandler({
    disabled,
    interactionPolicy,
    onCellPress,
    onMoveAttempt,
    selectedCell,
  });
  const canResize =
    resizable && onDimensionsChange !== undefined && !disabled && interactionPolicy !== 'passive';
  const height = width * (dimensions.rows / dimensions.columns);
  const cellSize = width / dimensions.columns;

  return (
    <View
      accessibilityLabel="Chess board"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.board,
        {
          aspectRatio: dimensions.columns / dimensions.rows,
          borderColor: colors.border,
          opacity: disabled ? 0.56 : 1,
        },
      ]}
      testID={testID}
    >
      {width > 0 ? (
        <GridView
          contentHeight={dimensions.rows}
          contentWidth={dimensions.columns}
          defaultViewport={{ pixelsPerUnitX: cellSize, pixelsPerUnitY: cellSize }}
          height={height}
          interactionPolicy="passive"
          items={cells}
          overscanPixels={0}
          renderItem={(item) => {
            const cell = cellById.get(item.id);
            return cell === undefined
              ? null
              : renderChessBoardCell({
                  cell,
                  cellSize,
                  colors,
                  disabled: disabled || interactionPolicy === 'passive',
                  lastMove,
                  legalTargetSet,
                  onPress: pressCell,
                  piece: piecesByCell.get(item.id),
                  renderPiece,
                  selectedCell,
                  showCoordinates,
                  testID,
                });
          }}
          width={width}
        />
      ) : null}
      {canResize ? renderChessBoardResizeActions(dimensions, onDimensionsChange, testID) : null}
    </View>
  );
}

/*** Render one accessible, caller-controlled rectangular board cell. */
function renderChessBoardCell({
  cell,
  cellSize,
  colors,
  disabled,
  lastMove,
  legalTargetSet,
  onPress,
  piece,
  renderPiece,
  selectedCell,
  showCoordinates,
  testID,
}: {
  readonly cell: ChessBoardCell & { readonly id: string };
  readonly cellSize: number;
  readonly colors: ReturnType<typeof createChessBoardColorScheme>;
  readonly disabled: boolean;
  readonly lastMove: ChessMoveAttempt | null;
  readonly legalTargetSet: ReadonlySet<string>;
  readonly onPress: (cell: ChessBoardCell) => void;
  readonly piece: ChessPieceState | undefined;
  readonly renderPiece: ChessBoardProps['renderPiece'];
  readonly selectedCell: ChessBoardCell | null;
  readonly showCoordinates: boolean;
  readonly testID: string | undefined;
}) {
  const light = (cell.column + cell.row) % 2 === 1;
  const key = getCellKey(cell);
  const backgroundColor = cellsEqual(selectedCell, cell)
    ? colors.selectedSquare
    : legalTargetSet.has(key)
      ? colors.legalTarget
      : cellsEqual(lastMove?.from, cell)
        ? colors.lastMoveFrom
        : cellsEqual(lastMove?.to, cell)
          ? colors.lastMoveTo
          : light
            ? colors.lightSquare
            : colors.darkSquare;
  const pieceContent =
    piece === undefined
      ? null
      : renderPiece
        ? renderPiece({
            cell,
            color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece,
            piece: piece.piece,
            size: cellSize,
          })
        : (symbols.get(`${piece.color}:${piece.piece.toLowerCase()}`) ?? piece.piece);
  const coordinate = formatCellCoordinate(cell);

  return (
    <Pressable
      accessibilityLabel={coordinate}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      key={key}
      onPress={() => onPress(cell)}
      style={[styles.square, { backgroundColor, height: cellSize, width: cellSize }]}
      testID={testID === undefined ? undefined : `${testID}-cell-${coordinate}`}
    >
      {showCoordinates ? (
        <Text
          style={[
            styles.coordinate,
            { color: light ? colors.lightSquareText : colors.darkSquareText },
          ]}
        >
          {coordinate}
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
                {
                  color: piece.color === 'white' ? colors.lightPiece : colors.darkPiece,
                  fontSize: cellSize * 0.58,
                  lineHeight: cellSize * 0.7,
                },
              ]}
            >
              {pieceContent}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

/*** Render bounded editor actions only when the caller explicitly enables dimension editing. */
function renderChessBoardResizeActions(
  dimensions: ChessBoardDimensions,
  onDimensionsChange: (dimensions: ChessBoardDimensions) => void,
  testID: string | undefined,
) {
  return (
    <View accessibilityLabel="Chess board dimensions" style={styles.resizeActions}>
      {renderResizeAction(
        'Add row',
        { ...dimensions, rows: dimensions.rows + 1 },
        onDimensionsChange,
        dimensions.rows < maximumDimension,
        testID,
      )}
      {renderResizeAction(
        'Remove row',
        { ...dimensions, rows: dimensions.rows - 1 },
        onDimensionsChange,
        dimensions.rows > minimumDimension,
        testID,
      )}
      {renderResizeAction(
        'Add column',
        { ...dimensions, columns: dimensions.columns + 1 },
        onDimensionsChange,
        dimensions.columns < maximumDimension,
        testID,
      )}
      {renderResizeAction(
        'Remove column',
        { ...dimensions, columns: dimensions.columns - 1 },
        onDimensionsChange,
        dimensions.columns > minimumDimension,
        testID,
      )}
    </View>
  );
}

/*** Render one caller-controlled dimension-change action. */
function renderResizeAction(
  label: string,
  dimensions: ChessBoardDimensions,
  onDimensionsChange: (dimensions: ChessBoardDimensions) => void,
  enabled: boolean,
  testID: string | undefined,
) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={!enabled}
      onPress={() => onDimensionsChange(dimensions)}
      testID={
        testID === undefined ? undefined : `${testID}-${label.toLowerCase().replace(' ', '-')}`
      }
    >
      <Text>{label}</Text>
    </Pressable>
  );
}

/*** Compares optional cell coordinates without attaching chess-rule meaning to them. */
function cellsEqual(
  left: ChessBoardCell | undefined | null,
  right: ChessBoardCell | undefined | null,
): boolean {
  if (!left || !right) return false;
  return left.column === right.column && left.row === right.row;
}

/*** Format a stable display label for a bounded board cell. */
function formatCellCoordinate(cell: ChessBoardCell): string {
  return `${String.fromCharCode(96 + cell.column)}${cell.row}`;
}

/*** Create a stable generic identity from caller-owned row and column values. */
function getCellKey(cell: ChessBoardCell): string {
  return `${cell.column}:${cell.row}`;
}

const styles = StyleSheet.create({
  board: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
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
  piece: { fontWeight: '600' },
  pieceContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  resizeActions: { flexDirection: 'row', gap: 8, padding: 8 },
  square: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
});
