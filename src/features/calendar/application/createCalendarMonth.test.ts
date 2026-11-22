import { describe, expect, test } from 'bun:test';

import { createCalendarMonth } from './createCalendarMonth';

describe('createCalendarMonth', () => {
  test('creates six complete weeks around a leap-year February with Sunday week start', () => {
    const cells = createCalendarMonth(new Date(2024, 1, 1), 0);

    expect(cells).toHaveLength(42);
    expect(cells[0]?.id).toBe('2024-01-28');
    expect(cells.find((cell) => cell.id === '2024-02-29')?.inDisplayedMonth).toBe(true);
    expect(cells[41]?.id).toBe('2024-03-09');
  });

  test('rotates month boundaries for Monday week starts without changing local date IDs', () => {
    const sunday = createCalendarMonth(new Date(2026, 2, 1), 0);
    const monday = createCalendarMonth(new Date(2026, 2, 1), 1);

    expect(sunday[0]?.id).toBe('2026-03-01');
    expect(monday[0]?.id).toBe('2026-02-23');
    expect(monday.find((cell) => cell.id === '2026-03-01')?.inDisplayedMonth).toBe(true);
  });
});
