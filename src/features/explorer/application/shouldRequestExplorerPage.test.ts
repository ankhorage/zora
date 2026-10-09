import { describe, expect, test } from 'bun:test';

import { shouldRequestExplorerPage } from './shouldRequestExplorerPage';

describe('Explorer paging boundary', () => {
  const ids = Array.from({ length: 100 }, (_, index) => `asset-${index}`);

  test('requests a page only when the visible virtual window reaches the loaded end', () => {
    expect(shouldRequestExplorerPage(ids, ['asset-50', 'asset-51'], true, false)).toBe(false);
    expect(shouldRequestExplorerPage(ids, ['asset-88', 'asset-89'], true, false)).toBe(true);
  });

  test('does not request while the provider has no page or is already loading one', () => {
    expect(shouldRequestExplorerPage(ids, ['asset-99'], false, false)).toBe(false);
    expect(shouldRequestExplorerPage(ids, ['asset-99'], true, true)).toBe(false);
  });
});
