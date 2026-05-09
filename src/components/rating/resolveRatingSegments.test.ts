import { describe, expect, test } from 'bun:test';

import { resolveRatingSegments } from './resolveRatingSegments';

describe('resolveRatingSegments', () => {
  test('returns empty segments for invalid input', () => {
    expect(resolveRatingSegments({ value: 3, max: 0 })).toEqual([]);
    expect(resolveRatingSegments({ value: Number.NaN, max: 5 })).toEqual([]);
  });

  test('clamps and rounds to nearest half-step', () => {
    expect(resolveRatingSegments({ value: -1, max: 5 })).toEqual([
      'empty',
      'empty',
      'empty',
      'empty',
      'empty',
    ]);

    expect(resolveRatingSegments({ value: 3, max: 5 })).toEqual([
      'full',
      'full',
      'full',
      'empty',
      'empty',
    ]);

    expect(resolveRatingSegments({ value: 3.2, max: 5 })).toEqual([
      'full',
      'full',
      'full',
      'empty',
      'empty',
    ]);

    expect(resolveRatingSegments({ value: 3.25, max: 5 })).toEqual([
      'full',
      'full',
      'full',
      'half',
      'empty',
    ]);

    expect(resolveRatingSegments({ value: 5, max: 5 })).toEqual([
      'full',
      'full',
      'full',
      'full',
      'full',
    ]);

    expect(resolveRatingSegments({ value: 6, max: 5 })).toEqual([
      'full',
      'full',
      'full',
      'full',
      'full',
    ]);
  });
});
