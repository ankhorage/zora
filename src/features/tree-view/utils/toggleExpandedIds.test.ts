import { expect, test } from 'bun:test';

import { toggleExpandedIds } from './toggleExpandedIds';

test('adds and removes expanded tree ids immutably', () => {
  const initial = ['src'] as const;
  const expanded = toggleExpandedIds(initial, 'test');

  expect(expanded).toEqual(['src', 'test']);
  expect(initial).toEqual(['src']);
  expect(toggleExpandedIds(expanded, 'src')).toEqual(['test']);
});
