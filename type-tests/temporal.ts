import type {
  TemporalAllDayEvent,
  TemporalEvent as RootTemporalEvent,
  TemporalReminder,
  TemporalTimedEvent,
} from '@ankhorage/zora';
import type { TemporalEvent as ReaderFreeTemporalEvent } from '@ankhorage/zora/reader-free';

const dstTimedEvent: RootTemporalEvent = {
  id: 'zurich-dst-timed',
  range: {
    allDay: false,
    end: '2026-10-25T01:30:00Z',
    start: '2026-10-25T00:30:00Z',
    timeZone: 'Europe/Zurich',
  },
  recurrence: {
    dates: ['2026-11-01T01:30:00Z'],
    excludedDates: ['2026-11-08T01:30:00Z'],
    rules: [{ frequency: 'weekly', until: '2026-11-29T01:30:00Z', weekdays: ['sunday'] }],
  },
  recurrenceExceptions: [{ recurrenceId: '2026-11-22T01:30:00Z', status: 'cancelled' }],
  reminders: [{ id: 'before-start', offset: '-PT15M', reference: 'start' }],
  title: 'DST-aware Sunday stand-up',
};

const allDayEvent: ReaderFreeTemporalEvent = {
  id: 'all-day-series',
  range: { allDay: true, end: '2026-10-26', start: '2026-10-24' },
  recurrence: {
    dates: ['2026-10-31'],
    excludedDates: ['2026-11-07'],
    rules: [{ frequency: 'weekly', until: '2026-11-28', weekdays: ['saturday'] }],
  },
  recurrenceExceptions: [{ recurrenceId: '2026-11-14', status: 'cancelled' }],
  reminders: [{ id: 'after-end', offset: 'PT15M', reference: 'end' }],
  title: 'All-day Saturday series',
};

const calendarEvent: RootTemporalEvent = {
  id: 'review',
  range: dstTimedEvent.range,
  title: 'Design review',
};

const schedulerEvent: RootTemporalEvent = {
  availability: 'busy',
  id: 'booking',
  range: dstTimedEvent.range,
  resourceIds: ['room-1'],
  title: 'Room booking',
};

const plannerItem: RootTemporalEvent = {
  editable: true,
  id: 'plan',
  range: allDayEvent.range,
  status: 'draft',
  title: 'Plan release',
};

const ganttItem: RootTemporalEvent = {
  id: 'task',
  metadata: { progress: 0.5 },
  range: dstTimedEvent.range,
  title: 'Implement contract',
};

const typedTimedEvent: TemporalTimedEvent = dstTimedEvent;
const typedAllDayEvent: TemporalAllDayEvent = allDayEvent;
const reminder: TemporalReminder = { id: 'on-end', offset: 'PT0S', reference: 'end' };

// @ts-expect-error all-day UNTIL must remain a calendar date.
const invalidAllDayUntil: ReaderFreeTemporalEvent = {
  id: 'invalid-all-day-until',
  range: { allDay: true, end: '2026-10-25', start: '2026-10-24' },
  recurrence: {
    rules: [
      {
        frequency: 'daily',
        until: '2026-10-25T00:00:00Z',
      },
    ],
  },
  title: 'Invalid all-day cutoff',
};

// @ts-expect-error timed RDATE must remain a UTC instant.
const invalidTimedDate: RootTemporalEvent = {
  id: 'invalid-timed-date',
  range: {
    allDay: false,
    end: '2026-10-24T10:00:00Z',
    start: '2026-10-24T09:00:00Z',
    timeZone: 'Europe/Zurich',
  },
  recurrence: {
    dates: ['2026-10-31'],
    rules: [],
  },
  title: 'Invalid timed RDATE',
};

// @ts-expect-error all-day exceptions require an all-day recurrence identifier.
const invalidAllDayException: ReaderFreeTemporalEvent = {
  id: 'invalid-all-day-exception',
  range: { allDay: true, end: '2026-10-25', start: '2026-10-24' },
  recurrenceExceptions: [
    {
      recurrenceId: '2026-10-24T00:00:00Z',
      status: 'cancelled',
    },
  ],
  title: 'Invalid all-day exception',
};

// @ts-expect-error reminders explicitly declare their reference point.
const invalidReminder: TemporalReminder = { id: 'invalid-reminder', offset: '-PT15M' };

void [
  allDayEvent,
  calendarEvent,
  dstTimedEvent,
  ganttItem,
  invalidAllDayException,
  invalidAllDayUntil,
  invalidReminder,
  invalidTimedDate,
  reminder,
  plannerItem,
  schedulerEvent,
  typedAllDayEvent,
  typedTimedEvent,
];
