import { expect, test } from 'bun:test';

import { resolveDataTableRowKey } from './resolveDataTableRowKey';

test('retains row identity across reordering using a serializable field name', () => {
  expect(resolveDataTableRowKey({ id: 'a' }, 0, 'id')).toBe('a');
  expect(resolveDataTableRowKey({ id: 'a' }, 12, 'id')).toBe('a');
  expect(resolveDataTableRowKey({ id: 0 }, 2, 'id')).toBe('0');
  expect(resolveDataTableRowKey({ id: 'a' }, 2, undefined, (row) => row.id)).toBe('a');
  expect(() => resolveDataTableRowKey({ id: null }, 0, 'id')).toThrow('rowKey');
});
