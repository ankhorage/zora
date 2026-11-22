import type { CalendarProps } from '../../../types/calendar';

/*** Resolves whether local-date range and disabled-date policy prevent selecting a calendar day. */
export function isCalendarDateDisabled({
  date,
  disabledDateIds,
  isDateDisabled,
  maxDate,
  minDate,
}: {
  date: Date;
  disabledDateIds: ReadonlySet<string>;
  isDateDisabled: CalendarProps['isDateDisabled'];
  maxDate: Date | undefined;
  minDate: Date | undefined;
}): boolean {
  return (
    (minDate !== undefined && compareLocalDates(date, minDate) < 0) ||
    (maxDate !== undefined && compareLocalDates(date, maxDate) > 0) ||
    disabledDateIds.has(formatCalendarDate(date)) ||
    isDateDisabled?.(date) === true
  );
}

/*** Compares values by local calendar date rather than their instant or time of day. */
function compareLocalDates(left: Date, right: Date): number {
  return startOfLocalDay(left).getTime() - startOfLocalDay(right).getTime();
}

/*** Removes a time-of-day component while retaining the caller's local calendar date. */
function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/*** Formats a Date as a timezone-independent local calendar identifier. */
function formatCalendarDate(value: Date): string {
  const year = String(value.getFullYear()).padStart(4, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
