import { describe, expect, it } from 'bun:test';

import { resolvePaginationState } from './resolvePaginationState';

describe('resolvePaginationState', () => {
  it('inserts ellipses between boundaries and siblings', () => {
    expect(
      resolvePaginationState({
        boundaryCount: 1,
        compact: false,
        page: 5,
        pageCount: 10,
        siblingCount: 1,
      }).items,
    ).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('returns only the active page in compact mode', () => {
    expect(
      resolvePaginationState({
        boundaryCount: 1,
        compact: true,
        page: 3,
        pageCount: 8,
        siblingCount: 1,
      }).items,
    ).toEqual([3]);
  });
});
