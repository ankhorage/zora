import type { ZoraBaseProps } from './base';

export type CalendarDensity = 'regular' | 'compact';
export type CalendarView = 'month';
export type CalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Public Calendar state uses local calendar dates, never UTC instants. */
export interface CalendarProps extends ZoraBaseProps {
  /** The only currently implemented Calendar presentation. */
  view?: CalendarView;
  density?: CalendarDensity;
  /** A local date within the controlled month to display. */
  displayedMonth?: Date;
  /** Initial local month when displayedMonth is not controlled. */
  defaultDisplayedMonth?: Date;
  onDisplayedMonthChange?: (month: Date) => void;
  selectedDate?: Date | null;
  onSelectedDateChange?: (date: Date) => void;
  locale?: string;
  weekStartsOn?: CalendarWeekStart;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: readonly Date[];
  isDateDisabled?: (date: Date) => boolean;
}
