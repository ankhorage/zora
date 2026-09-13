import { describe, expect, test } from 'bun:test';

import { formatLocalDate, parseLocalDate } from './localDate';

describe('local date serialization', () => {
  test('round-trips a valid YYYY-MM-DD value without a UTC conversion', () => {
    const parsed = parseLocalDate('2026-09-13');

    expect(parsed).toBeDefined();
    expect(parsed ? formatLocalDate(parsed) : undefined).toBe('2026-09-13');
  });

  test('rejects malformed and impossible calendar dates', () => {
    expect(parseLocalDate('2026-2-03')).toBeUndefined();
    expect(parseLocalDate('2026-02-30')).toBeUndefined();
    expect(parseLocalDate(null)).toBeUndefined();
  });
});
