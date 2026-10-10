import { describe, expect, test } from 'bun:test';

import {
  calendarDayMinuteToWorld,
  createCalendarAxis,
  PPQ,
  resolveCalendarAxisWidth,
  resolveDawBarStartPpq,
  snapDawPpqTick,
} from './timeGridDemoAdapters';

describe('TimeGrid demo adapters', () => {
  test('maps bars through the actual 4/4 to 7/8 transition', () => {
    expect(resolveDawBarStartPpq(0)).toBe(0);
    expect(resolveDawBarStartPpq(4)).toBe(4 * 4 * PPQ);
    expect(resolveDawBarStartPpq(5) - resolveDawBarStartPpq(4)).toBe((7 * PPQ) / 2);
  });

  test('keeps 1/16 snapping fixed while presentation ruler density changes', () => {
    const rulerBeatDensities = [1, 2, 4] as const;
    const snapped = rulerBeatDensities.map(() => snapDawPpqTick(3 * PPQ + 97));

    expect(snapped).toEqual([3 * PPQ + 120, 3 * PPQ + 120, 3 * PPQ + 120]);
  });

  test('retains every calendar day between the March and October DST transitions', () => {
    const calendarDays = createCalendarAxis(
      '2026-03-28',
      '2026-10-26',
      new Map([
        ['2026-03-29', 23 * 60],
        ['2026-10-25', 25 * 60],
      ]),
    );

    expect(calendarDays).toHaveLength(213);
    expect(calendarDayMinuteToWorld(calendarDays, '2026-10-24', 0)).toBeGreaterThan(200 * 24 * 60);
    expect(resolveCalendarAxisWidth(calendarDays)).toBe(213 * 24 * 60);
  });

  test('preserves 23- and 25-hour local days as external calendar-axis geometry', () => {
    const calendarDays = createCalendarAxis(
      '2026-03-28',
      '2026-10-26',
      new Map([
        ['2026-03-29', 23 * 60],
        ['2026-10-25', 25 * 60],
      ]),
    );

    expect(
      calendarDayMinuteToWorld(calendarDays, '2026-03-30', 0) -
        calendarDayMinuteToWorld(calendarDays, '2026-03-29', 0),
    ).toBe(23 * 60);
    expect(
      calendarDayMinuteToWorld(calendarDays, '2026-10-26', 0) -
        calendarDayMinuteToWorld(calendarDays, '2026-10-25', 0),
    ).toBe(25 * 60);
  });
});
