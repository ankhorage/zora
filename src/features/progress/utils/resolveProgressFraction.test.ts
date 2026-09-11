import { describe, expect, test } from 'bun:test';

import { resolveProgressFraction } from './resolveProgressFraction';

describe('resolveProgressFraction', () => {
  test('clamps values to [0, 1]', () => {
    expect(resolveProgressFraction({ value: -5, max: 10 })).toBe(0);
    expect(resolveProgressFraction({ value: 0, max: 10 })).toBe(0);
    expect(resolveProgressFraction({ value: 5, max: 10 })).toBe(0.5);
    expect(resolveProgressFraction({ value: 10, max: 10 })).toBe(1);
    expect(resolveProgressFraction({ value: 15, max: 10 })).toBe(1);
  });

  test('returns 0 for invalid max', () => {
    expect(resolveProgressFraction({ value: 5, max: 0 })).toBe(0);
    expect(resolveProgressFraction({ value: 5, max: -3 })).toBe(0);
    expect(resolveProgressFraction({ value: 5, max: Number.NaN })).toBe(0);
  });

  test('returns 0 for invalid value', () => {
    expect(resolveProgressFraction({ value: Number.NaN, max: 10 })).toBe(0);
  });
});
