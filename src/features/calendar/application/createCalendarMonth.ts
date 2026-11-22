import type { CalendarWeekStart } from '../../../types/calendar';

export type CalendarMonthCell = Readonly<{
  date: Date;
  id: string;
  inDisplayedMonth: boolean;
}>;

/*** Creates the fixed six-week local-date month geometry shared by every Calendar density. */
export function createCalendarMonth(
  month: Date,
  weekStartsOn: CalendarWeekStart,
): readonly CalendarMonthCell[] {
  const firstDay = startOfLocalMonth(month);
  const leadingDays = (firstDay.getDay() - weekStartsOn + 7) % 7;

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstDay.getFullYear(), firstDay.getMonth(), index - leadingDays + 1);
    return {
      date,
      id: formatLocalDate(date),
      inDisplayedMonth: date.getMonth() === firstDay.getMonth(),
    };
  });
}

/*** Formats a Date as a timezone-independent local calendar identifier. */
function formatLocalDate(value: Date): string {
  const year = String(value.getFullYear()).padStart(4, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/*** Normalizes a value to the first local day of its month. */
function startOfLocalMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}
