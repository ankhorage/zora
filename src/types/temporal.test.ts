import { expect, test } from 'bun:test';

import type { TemporalEvent, TemporalRange } from './temporal';

const timedRange = {
  allDay: false,
  end: '2026-10-24T09:30:00Z',
  start: '2026-10-24T09:00:00Z',
  timeZone: 'Europe/Zurich',
} as const satisfies TemporalRange;

const allDayRange = {
  allDay: true,
  duration: 'P1D',
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

test('keeps recurrence, exceptions and interoperability values serializable', () => {
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
      excludedDates: ['2026-11-06T09:00:00Z'],
      rules: [{ frequency: 'weekly', interval: 2, weekdays: ['friday'] }],
    },
    recurrenceExceptions: [{ recurrenceId: '2026-11-20T09:00:00Z', status: 'cancelled' }],
    title: 'Biweekly review',
  } as const satisfies TemporalEvent;

  expect(JSON.parse(JSON.stringify(event))).toEqual(event);
});
