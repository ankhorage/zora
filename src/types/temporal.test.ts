import { expect, test } from 'bun:test';

import type { TemporalEvent, TemporalRange } from './temporal';

const timedRange = {
  allDay: false,
  end: '2026-10-25T09:30:00Z',
  start: '2026-10-25T09:00:00Z',
  timeZone: 'Europe/Zurich',
} as const satisfies TemporalRange;

const allDayRange = {
  allDay: true,
  end: '2026-10-25',
  start: '2026-10-24',
} as const satisfies TemporalRange;

test('models calendar, scheduler, planner and Gantt inputs as provider-neutral serialized data', () => {
  const calendarEvent = {
    id: 'review',
    range: timedRange,
    title: 'Design review',
  } as const satisfies TemporalEvent;
  const schedulerEvent = {
    availability: 'busy',
    id: 'booking',
    range: timedRange,
    resourceIds: ['room-1'],
    title: 'Room booking',
  } as const satisfies TemporalEvent;
  const plannerItem = {
    editable: true,
    id: 'plan',
    range: allDayRange,
    status: 'draft',
    title: 'Plan release',
  } as const satisfies TemporalEvent;
  const ganttItem = {
    id: 'task',
    metadata: { progress: 0.5 },
    range: timedRange,
    title: 'Implement contract',
  } as const satisfies TemporalEvent;

  expect([calendarEvent, schedulerEvent, plannerItem, ganttItem]).toHaveLength(4);
});

test('keeps Europe/Zurich DST, all-day and recurrence edge fixtures serializable', () => {
  const event = {
    id: 'series',
    interoperability: [
      {
        format: 'icalendar',
        value: { uid: 'series@example.test', xProperties: ['X-OWNER:calendar'] },
      },
    ],
    range: timedRange,
    recurrence: {
      dates: ['2026-11-01T09:00:00Z'],
      excludedDates: ['2026-11-08T09:00:00Z'],
      rules: [
        {
          frequency: 'weekly',
          interval: 2,
          until: '2026-11-29T09:00:00Z',
          weekdays: ['sunday'],
        },
      ],
    },
    recurrenceExceptions: [{ recurrenceId: '2026-11-22T09:00:00Z', status: 'cancelled' }],
    reminders: [{ id: 'before-start', offset: '-PT15M', reference: 'start' }],
    title: 'Biweekly review',
  } as const satisfies TemporalEvent;
  const allDayEvent = {
    id: 'all-day-series',
    range: allDayRange,
    recurrence: {
      dates: ['2026-10-31'],
      excludedDates: ['2026-11-07'],
      rules: [{ frequency: 'weekly', until: '2026-11-28', weekdays: ['saturday'] }],
    },
    recurrenceExceptions: [{ recurrenceId: '2026-11-14', status: 'cancelled' }],
    reminders: [{ id: 'after-end', offset: 'PT15M', reference: 'end' }],
    title: 'All-day Saturday series',
  } as const satisfies TemporalEvent;

  expect(JSON.parse(JSON.stringify([allDayEvent, event]))).toEqual([allDayEvent, event]);
});
