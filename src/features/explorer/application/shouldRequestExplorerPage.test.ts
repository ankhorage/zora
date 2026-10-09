import { describe, expect, test } from 'bun:test';

import { shouldRequestExplorerPage } from './shouldRequestExplorerPage';

describe('Explorer paging boundary', () => {
  const ids = Array.from({ length: 100 }, (_, index) => `asset-${index}`);
  const available = ['granted', 'limited'] as const;

  test('requests a page only when the visible virtual window reaches the loaded end', () => {
    expect(
      shouldRequestExplorerPage(
        ids,
        ['asset-50', 'asset-51'],
        true,
        false,
        false,
        undefined,
        'granted',
      ),
    ).toBe(false);
    expect(
      shouldRequestExplorerPage(
        ids,
        ['asset-88', 'asset-89'],
        true,
        false,
        false,
        undefined,
        'granted',
      ),
    ).toBe(true);
  });

  test('does not request while the provider has no page or is already loading one', () => {
    expect(
      shouldRequestExplorerPage(ids, ['asset-99'], false, false, false, undefined, 'granted'),
    ).toBe(false);
    expect(
      shouldRequestExplorerPage(ids, ['asset-99'], true, true, false, undefined, 'granted'),
    ).toBe(false);
  });

  test('gates paging until the collection is accessible, loaded, and error-free', () => {
    for (const permissionStatus of ['denied', 'unavailable'] as const) {
      expect(
        shouldRequestExplorerPage(
          ids,
          ['asset-99'],
          true,
          false,
          false,
          undefined,
          permissionStatus,
        ),
      ).toBe(false);
    }
    for (const permissionStatus of available) {
      expect(
        shouldRequestExplorerPage(
          ids,
          ['asset-99'],
          true,
          false,
          true,
          undefined,
          permissionStatus,
        ),
      ).toBe(false);
      expect(
        shouldRequestExplorerPage(
          ids,
          ['asset-99'],
          true,
          false,
          false,
          'Failed to load',
          permissionStatus,
        ),
      ).toBe(false);
      expect(
        shouldRequestExplorerPage(
          ids,
          ['asset-99'],
          true,
          false,
          false,
          undefined,
          permissionStatus,
        ),
      ).toBe(true);
    }
  });
});
