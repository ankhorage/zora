import { describe, expect, test } from 'bun:test';

import { chessBoardMeta } from './meta';
import { createChessBoardCellPressHandler } from './utils/createChessBoardCellPressHandler';
import { createChessBoardCells } from './utils/createChessBoardCells';

describe('Chess presentation', () => {
  test('declares caller-owned dimensions, cells, and move intents without rule-engine events', () => {
    expect(chessBoardMeta.blueprint.defaultProps).toMatchObject({ columns: 8, rows: 8 });
    expect(chessBoardMeta.props.columns.default).toBe(8);
    expect(chessBoardMeta.props.rows.default).toBe(8);
    expect(chessBoardMeta.events.cellPress.payloadFields).toEqual([
      { path: 'column', type: 'number', label: 'Column' },
      { path: 'row', type: 'number', label: 'Row' },
    ]);
    expect(chessBoardMeta.events).not.toHaveProperty('legalMove');
    expect(chessBoardMeta.events).not.toHaveProperty('invalidMove');
  });

  test('uses the shared GridView presentation boundary rather than a chess rules engine', async () => {
    const source = await Bun.file('src/features/chess/adapters/inbound/ChessBoard.tsx').text();

    expect(source).toContain("import { GridView } from '../../../grid-view/public';");
    expect(source).not.toContain('chess.js');
    expect(source).not.toContain('fen');
  });

  test('maps non-square boards into opposite GridView coordinates for white and black orientation', () => {
    const white = createChessBoardCells(3, 2, 'white');
    const black = createChessBoardCells(3, 2, 'black');

    expect(white.find((cell) => cell.column === 1 && cell.row === 2)).toMatchObject({
      x: 0,
      y: 0,
    });
    expect(white.find((cell) => cell.column === 3 && cell.row === 1)).toMatchObject({
      x: 2,
      y: 1,
    });
    expect(black.find((cell) => cell.column === 3 && cell.row === 1)).toMatchObject({
      x: 0,
      y: 0,
    });
    expect(black.find((cell) => cell.column === 1 && cell.row === 2)).toMatchObject({
      x: 2,
      y: 1,
    });
  });

  test('accepts only the documented 2 through 24 presentation dimensions', () => {
    expect(createChessBoardCells(2, 24, 'white')).toHaveLength(48);
    expect(() => createChessBoardCells(1, 8, 'white')).toThrow(RangeError);
    expect(() => createChessBoardCells(8, 25, 'black')).toThrow(RangeError);
    expect(() => createChessBoardCells(2.5, 8, 'white')).toThrow(RangeError);
  });

  test('emits caller-owned press and move intents without acting in passive mode', () => {
    const presses: unknown[] = [];
    const attempts: unknown[] = [];
    const active = createChessBoardCellPressHandler({
      onCellPress: (cell) => presses.push(cell),
      onMoveAttempt: (attempt) => attempts.push(attempt),
      selectedCell: { column: 2, row: 2 },
    });

    active({ column: 3, row: 4 });
    createChessBoardCellPressHandler({
      interactionPolicy: 'passive',
      onCellPress: (cell) => presses.push(cell),
      onMoveAttempt: (attempt) => attempts.push(attempt),
      selectedCell: { column: 2, row: 2 },
    })({ column: 4, row: 4 });

    expect(presses).toEqual([{ column: 3, row: 4 }]);
    expect(attempts).toEqual([{ from: { column: 2, row: 2 }, to: { column: 3, row: 4 } }]);
  });

  test('describes selected cells and legal targets as cell objects in manifest metadata', () => {
    expect(chessBoardMeta.props.selectedCell).toMatchObject({
      type: 'object',
      itemSchema: [{ key: 'column' }, { key: 'row' }],
    });
    expect(chessBoardMeta.props.legalTargets).toMatchObject({
      type: 'array',
      itemSchema: [{ key: 'column' }, { key: 'row' }],
    });
    expect(chessBoardMeta.bindings.props.selectedCell.value).toMatchObject({
      type: 'object',
      fields: [{ path: 'column' }, { path: 'row' }],
    });
    expect(chessBoardMeta.bindings.props.legalTargets.value).toMatchObject({
      type: 'array',
      itemType: 'object',
      fields: [{ path: '[].column' }, { path: '[].row' }],
    });
  });
});
