/** A calendar date without a time or timezone, represented as `YYYY-MM-DD`. */
export type TemporalDate = `${number}-${number}-${number}`;

/** A UTC ISO-8601 instant, represented as an RFC 3339 string ending in `Z`. */
export type TemporalInstant = `${string}Z`;

/** An IANA timezone identifier such as `Europe/Zurich`. */
export type TemporalTimeZone = string;

/** An ISO-8601 duration string such as `PT30M`. */
export type TemporalDuration = string;

/** Data that remains safe to serialize through manifests and provider boundaries. */
export type TemporalDataValue =
  | boolean
  | null
  | number
  | string
  | readonly TemporalDataValue[]
  | { readonly [key: string]: TemporalDataValue };

/** A timed or all-day interval with exactly one way to define its end. */
export type TemporalRange =
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
    }
  | {
      readonly allDay: true;
      readonly start: TemporalDate;
      readonly end: TemporalDate;
      readonly duration?: never;
      readonly timeZone?: TemporalTimeZone;
    }
  | {
      readonly allDay: true;
      readonly start: TemporalDate;
      readonly end?: never;
      readonly duration: TemporalDuration;
      readonly timeZone?: TemporalTimeZone;
    };

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

/** A reminder that a presentation or provider adapter can schedule. */
export interface TemporalReminder {
  readonly id: string;
  readonly offset: TemporalDuration;
  readonly channel?: 'display' | 'email' | 'push';
}

/** One normalized recurrence rule; adapter layers map this to and from standards such as RRULE. */
export interface TemporalRecurrenceRule {
  readonly frequency: 'daily' | 'monthly' | 'weekly' | 'yearly';
  readonly interval?: number;
  readonly count?: number;
  readonly until?: TemporalInstant;
  readonly weekdays?: readonly (
    'friday' | 'monday' | 'saturday' | 'sunday' | 'thursday' | 'tuesday' | 'wednesday'
  )[];
  readonly monthDays?: readonly number[];
  readonly months?: readonly number[];
}

/** Recurrence data retained independently from provider-specific series representations. */
export interface TemporalRecurrence {
  readonly rules: readonly TemporalRecurrenceRule[];
  readonly dates?: readonly (TemporalDate | TemporalInstant)[];
  readonly excludedDates?: readonly (TemporalDate | TemporalInstant)[];
}

/** A detached occurrence that replaces or cancels one generated recurrence instance. */
export interface TemporalRecurrenceException {
  readonly recurrenceId: TemporalDate | TemporalInstant;
  readonly status: 'cancelled' | 'replacement';
  readonly range?: TemporalRange;
  readonly title?: string;
}

/** Lossless serialized data that an interoperability adapter must round-trip without exposing its runtime. */
export interface TemporalInteroperabilityData {
  readonly format: 'icalendar' | 'jcal' | 'provider';
  readonly value: TemporalDataValue;
}

/** Provider-neutral, serializable event data shared by future Calendar and Scheduler presentations. */
export interface TemporalEvent {
  readonly id: string;
  readonly title: string;
  readonly range: TemporalRange;
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
  readonly recurrence?: TemporalRecurrence;
  readonly recurrenceExceptions?: readonly TemporalRecurrenceException[];
  readonly editable?: boolean;
  readonly metadata?: Readonly<Record<string, TemporalDataValue>>;
  readonly interoperability?: readonly TemporalInteroperabilityData[];
}
