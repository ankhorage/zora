/** A calendar date without a time or timezone, represented as `YYYY-MM-DD`. */
export type TemporalDate = `${number}-${number}-${number}`;

/** A UTC ISO-8601 instant, represented as an RFC 3339 string ending in `Z`. */
export type TemporalInstant = `${string}Z`;

/** An IANA timezone identifier such as `Europe/Zurich`. */
export type TemporalTimeZone = string;

/** An ISO-8601 duration string such as `PT30M` or `-PT15M`. */
export type TemporalDuration = string;

/**
 * This contract describes serializable shape, not runtime validation. Consumers must validate
 * RFC 3339 instants, ISO calendar dates and durations, IANA zone identifiers, positive non-zero
 * intervals, ordered ranges, and finite JSON numbers at their input boundary.
 */
export type TemporalDataValue =
  | boolean
  | null
  | number
  | string
  | readonly TemporalDataValue[]
  | { readonly [key: string]: TemporalDataValue };

/**
 * A timed interval with exactly one exclusive end. Recurring timed events retain the local
 * wall-clock time derived from `start` in `timeZone` across DST transitions; a recurrence engine
 * materializes each occurrence as its corresponding UTC instant.
 */
export type TemporalTimedRange =
  | {
      readonly allDay: false;
      readonly start: TemporalInstant;
      readonly end: TemporalInstant;
      readonly duration?: never;
      readonly timeZone: TemporalTimeZone;
    }
  | {
      readonly allDay: false;
      readonly start: TemporalInstant;
      readonly end?: never;
      readonly duration: TemporalDuration;
      readonly timeZone: TemporalTimeZone;
    };

/**
 * A timezone-free all-day calendar-date interval with exactly one exclusive end. `end` is the
 * first day not included, so a one-day event from `2026-10-24` ends on `2026-10-25`.
 */
export type TemporalAllDayRange =
  | {
      readonly allDay: true;
      readonly start: TemporalDate;
      readonly end: TemporalDate;
      readonly duration?: never;
    }
  | {
      readonly allDay: true;
      readonly start: TemporalDate;
      readonly end?: never;
      readonly duration: TemporalDuration;
    };

/** A timed or all-day interval with exactly one way to define its exclusive end. */
export type TemporalRange = TemporalAllDayRange | TemporalTimedRange;

/** The availability an event contributes without disclosing its details. */
export type TemporalAvailability = 'free' | 'busy' | 'tentative' | 'unavailable';

/** A provider-neutral lifecycle state for a scheduled event. */
export type TemporalEventStatus = 'cancelled' | 'confirmed' | 'draft' | 'tentative';

/** A semantic theme treatment that later ZORA renderers resolve through their active theme. */
export type TemporalTone = 'accent' | 'critical' | 'info' | 'neutral' | 'positive' | 'warning';

/** A person or organization participating in an event without provider-specific identity objects. */
export interface TemporalParticipant {
  readonly id?: string;
  readonly name?: string;
  readonly email?: string;
  readonly role?: 'optional' | 'organizer' | 'required' | 'resource';
  readonly response?: 'accepted' | 'declined' | 'delegated' | 'needs-action' | 'tentative';
}

/**
 * A reminder relative to the event start or exclusive end. A negative ISO duration fires before
 * that reference point; a positive duration fires after it.
 */
export interface TemporalReminder {
  readonly id: string;
  readonly offset: TemporalDuration;
  readonly reference: 'end' | 'start';
  readonly channel?: 'display' | 'email' | 'push';
}

/**
 * One normalized recurrence rule. `until` has the same value type as DTSTART: a date for all-day
 * series and a UTC instant for timed series. Adapter layers map this to and from RFC 5545 RRULE.
 */
export interface TemporalRecurrenceRule<TValue extends TemporalDate | TemporalInstant> {
  readonly frequency: 'daily' | 'monthly' | 'weekly' | 'yearly';
  readonly interval?: number;
  readonly count?: number;
  readonly until?: TValue;
  readonly weekdays?: readonly (
    'friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday'
  )[];
  readonly monthDays?: readonly number[];
  readonly months?: readonly number[];
}

/**
 * Recurrence data retained independently from provider-specific series representations. `dates`
 * and `excludedDates` correspond to RFC 5545 RDATE and EXDATE and use the DTSTART value type.
 */
export interface TemporalRecurrence<TValue extends TemporalDate | TemporalInstant> {
  readonly rules: readonly TemporalRecurrenceRule<TValue>[];
  readonly dates?: readonly TValue[];
  readonly excludedDates?: readonly TValue[];
}

/**
 * A detached occurrence that replaces or cancels one generated recurrence instance. `recurrenceId`
 * is the original scheduled DTSTART value: for timed DST series, the UTC instant materialized from
 * that occurrence's wall-clock time in the series timezone; for all-day series, its calendar date.
 */
export interface TemporalRecurrenceException<
  TValue extends TemporalDate | TemporalInstant,
  TRange extends TemporalRange,
> {
  readonly recurrenceId: TValue;
  readonly status: 'cancelled' | 'replacement';
  readonly range?: TRange;
  readonly title?: string;
}

/** Lossless serialized data that an interoperability adapter must round-trip without exposing its runtime. */
export interface TemporalInteroperabilityData {
  readonly format: 'icalendar' | 'jcal' | 'provider';
  readonly value: TemporalDataValue;
}

interface TemporalEventBase {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly location?: string;
  readonly conferenceUrl?: string;
  readonly calendarId?: string;
  readonly tone?: TemporalTone;
  readonly availability?: TemporalAvailability;
  readonly status?: TemporalEventStatus;
  readonly resourceIds?: readonly string[];
  readonly organizer?: TemporalParticipant;
  readonly attendees?: readonly TemporalParticipant[];
  readonly reminders?: readonly TemporalReminder[];
  readonly editable?: boolean;
  readonly metadata?: Readonly<Record<string, TemporalDataValue>>;
  readonly interoperability?: readonly TemporalInteroperabilityData[];
}

/** A provider-neutral timed event with instant-based recurrence values. */
export interface TemporalTimedEvent extends TemporalEventBase {
  readonly range: TemporalTimedRange;
  readonly recurrence?: TemporalRecurrence<TemporalInstant>;
  readonly recurrenceExceptions?: readonly TemporalRecurrenceException<
    TemporalInstant,
    TemporalTimedRange
  >[];
}

/** A provider-neutral all-day event with date-based recurrence values. */
export interface TemporalAllDayEvent extends TemporalEventBase {
  readonly range: TemporalAllDayRange;
  readonly recurrence?: TemporalRecurrence<TemporalDate>;
  readonly recurrenceExceptions?: readonly TemporalRecurrenceException<
    TemporalDate,
    TemporalAllDayRange
  >[];
}

/** Provider-neutral, serializable event data shared by future Calendar and Scheduler presentations. */
export type TemporalEvent = TemporalAllDayEvent | TemporalTimedEvent;
