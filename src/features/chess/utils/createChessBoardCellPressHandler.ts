import type { ChessBoardCell, ChessBoardProps } from '../../../types/chess';

type ChessBoardCellPressHandlerOptions = Pick<
  ChessBoardProps,
  'disabled' | 'interactionPolicy' | 'onCellPress' | 'onMoveAttempt' | 'selectedCell'
>;

/*** Creates the caller-owned cell and move intent boundary for an interactive chess presentation. */
export function createChessBoardCellPressHandler({
  disabled,
  interactionPolicy,
  onCellPress,
  onMoveAttempt,
  selectedCell,
}: ChessBoardCellPressHandlerOptions): (cell: ChessBoardCell) => void {
  return (cell) => {
    if (disabled || interactionPolicy === 'passive') return;

    onCellPress?.(cell);
    if (selectedCell === null || selectedCell === undefined || cellsEqual(selectedCell, cell)) {
      return;
    }
    onMoveAttempt?.({ from: selectedCell, to: cell });
  };
}

/*** Compares caller-owned coordinates without adding chess-rule semantics. */
function cellsEqual(left: ChessBoardCell, right: ChessBoardCell): boolean {
  return left.column === right.column && left.row === right.row;
}
