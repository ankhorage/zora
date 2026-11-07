import { describe, expect, test } from 'bun:test';

import { chessBoardMeta } from './meta';

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
});
