import { describe, expect, test } from 'bun:test';

import {
  type ExplorerPageRequestSignature,
  shouldDispatchExplorerPageRequest,
} from './shouldDispatchExplorerPageRequest';

describe('Explorer page request lifecycle', () => {
  const initialRequest: ExplorerPageRequestSignature = {
    collectionId: 'recent-media',
    loadedItemCount: 60,
    retryToken: undefined,
  };

  test('deduplicates a settled or failed request until the provider explicitly retries it', () => {
    expect(shouldDispatchExplorerPageRequest(null, initialRequest)).toBe(true);
    expect(shouldDispatchExplorerPageRequest(initialRequest, initialRequest)).toBe(false);
    expect(
      shouldDispatchExplorerPageRequest(initialRequest, {
        ...initialRequest,
        retryToken: 'retry-1',
      }),
    ).toBe(true);
  });

  test('resets paging for a replacement collection with the same loaded row count', () => {
    expect(
      shouldDispatchExplorerPageRequest(initialRequest, {
        ...initialRequest,
        collectionId: 'search-results',
      }),
    ).toBe(true);
  });

  test('allows the next normal page when the provider extends the collection', () => {
    expect(
      shouldDispatchExplorerPageRequest(initialRequest, {
        ...initialRequest,
        loadedItemCount: 120,
      }),
    ).toBe(true);
  });
});
