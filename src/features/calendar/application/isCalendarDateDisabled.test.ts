import { describe, expect, test } from 'bun:test';

import { isCalendarDateDisabled } from './isCalendarDateDisabled';

describe('isCalendarDateDisabled', () => {
  test('applies local-date min/max bounds regardless of time of day', () => {
    expect(
      isCalendarDateDisabled({
        date: new Date(2026, 4, 9, 23),
        disabledDateIds: new Set(),
        isDateDisabled: undefined,
        maxDate: new Date(2026, 4, 20),
        minDate: new Date(2026, 4, 10, 18),
      }),
    ).toBe(true);
    expect(
      isCalendarDateDisabled({
        date: new Date(2026, 4, 20, 1),
        disabledDateIds: new Set(),
        isDateDisabled: undefined,
        maxDate: new Date(2026, 4, 20, 0),
        minDate: new Date(2026, 4, 10),
      }),
    ).toBe(false);
  });

  test('combines explicit and predicate disabled dates', () => {
    const disabledDateIds = new Set(['2026-05-12']);

    expect(
      isCalendarDateDisabled({
        date: new Date(2026, 4, 12),
        disabledDateIds,
        isDateDisabled: undefined,
        maxDate: undefined,
        minDate: undefined,
      }),
    ).toBe(true);
    expect(
      isCalendarDateDisabled({
        date: new Date(2026, 4, 13),
        disabledDateIds,
        isDateDisabled: (date) => date.getDay() === 3,
        maxDate: undefined,
        minDate: undefined,
      }),
    ).toBe(true);
  });
});
