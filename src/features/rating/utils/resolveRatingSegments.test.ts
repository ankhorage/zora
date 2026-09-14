import { describe, expect, it } from 'bun:test';

import { resolveRatingSegments } from './resolveRatingSegments';

describe('resolveRatingSegments', () => {
  it('supports full and half values', () => {
    expect(resolveRatingSegments({ max: 5, value: 4.5 })).toEqual([
      'full',
      'full',
      'full',
      'full',
      'half',
    ]);
  });

  it('clamps values to the rating range', () => {
    expect(resolveRatingSegments({ max: 3, value: -1 })).toEqual(['empty', 'empty', 'empty']);
    expect(resolveRatingSegments({ max: 2, value: 4 })).toEqual(['full', 'full']);
  });
});
