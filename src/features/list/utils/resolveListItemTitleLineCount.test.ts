import { expect, test } from 'bun:test';

import { resolveListItemTitleLineCount } from './resolveListItemTitleLineCount';

test('keeps compact list item titles to one line', () => {
  expect(resolveListItemTitleLineCount(true)).toBe(1);
});

test('preserves unrestricted non-compact list item titles', () => {
  expect(resolveListItemTitleLineCount(false)).toBeUndefined();
});
