export const PPQ = 480;
export const SIXTEENTH_NOTE_TICKS = PPQ / 4;

interface TimeSignature {
  readonly denominator: 4 | 8;
  readonly numerator: number;
}

interface MeterChange extends TimeSignature {
  readonly startBar: number;
}

interface CalendarDay {
  readonly duration: number;
  readonly id: string;
}

const meterChanges: readonly MeterChange[] = [
  { denominator: 4, numerator: 4, startBar: 0 },
  { denominator: 8, numerator: 7, startBar: 4 },
];

const MINUTES_PER_HOUR = 60;
const DEFAULT_DAY_DURATION = 24 * MINUTES_PER_HOUR;

/*** Resolves a DAW bar origin in PPQ coordinates across the actual 4/4 to 7/8 meter transition. */
export function resolveDawBarStartPpq(bar: number): number {
  const meterChangeIndex = meterChanges.findLastIndex((change) => change.startBar <= bar);
  const meterChange = meterChanges[meterChangeIndex];
  if (!meterChange) throw new Error(`No meter signature resolves bar ${bar}.`);

  const precedingChanges = meterChanges.slice(0, meterChangeIndex);
  const origin = precedingChanges.reduce((total, change, index) => {
    const nextChange = meterChanges[index + 1];
    if (!nextChange) throw new Error(`No following meter signature resolves bar ${bar}.`);
    const barCount = nextChange.startBar - change.startBar;
    return total + barCount * getMeterBarLengthPpq(change);
  }, 0);
  return origin + (bar - meterChange.startBar) * getMeterBarLengthPpq(meterChange);
}

/*** Snaps a PPQ coordinate at a fixed 1/16 resolution without consulting presentation ruler density. */
export function snapDawPpqTick(tick: number): number {
  return Math.round(tick / SIXTEENTH_NOTE_TICKS) * SIXTEENTH_NOTE_TICKS;
}

/*** Maps an optional host tempo adapter input to the PPQ world coordinates consumed by TimeGrid. */
export function secondsToPpqTicks(seconds: number, beatsPerMinute: number): number {
  return seconds * (beatsPerMinute / 60) * PPQ;
}

/*** Builds a complete calendar axis using externally supplied local-day durations. */
export function createCalendarAxis(
  firstDayId: string,
  lastDayId: string,
  dayDurations: Readonly<Record<string, number>>,
): readonly CalendarDay[] {
  const firstDay = parseIsoDay(firstDayId);
  const lastDay = parseIsoDay(lastDayId);
  const days: CalendarDay[] = [];

  for (
    let day = firstDay;
    day <= lastDay;
    day = new Date(day.getTime() + DEFAULT_DAY_DURATION * MINUTES_PER_HOUR * 1000)
  ) {
    const id = day.toISOString().slice(0, 10);
    days.push({ duration: dayDurations[id] ?? DEFAULT_DAY_DURATION, id });
  }

  return days;
}

/*** Converts an external calendar day and minute offset into the generic numeric TimeGrid world. */
export function calendarDayMinuteToWorld(
  calendarDays: readonly CalendarDay[],
  dayId: string,
  minute: number,
): number {
  const dayIndex = calendarDays.findIndex((day) => day.id === dayId);
  if (dayIndex === -1) throw new Error(`Calendar axis does not contain ${dayId}.`);
  return calendarDays.slice(0, dayIndex).reduce((total, day) => total + day.duration, 0) + minute;
}

/*** Sums the nonuniform day durations to derive the TimeGrid world extent. */
export function resolveCalendarAxisWidth(calendarDays: readonly CalendarDay[]): number {
  return calendarDays.reduce((total, day) => total + day.duration, 0);
}

function getMeterBarLengthPpq(signature: TimeSignature): number {
  return signature.numerator * ((PPQ * 4) / signature.denominator);
}

function parseIsoDay(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Expected an ISO calendar day, received ${value}.`);
  }
  return date;
}
