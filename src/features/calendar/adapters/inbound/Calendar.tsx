import type { GridRectItem } from '@ankhorage/grid-view';
import React from 'react';

import type { CalendarProps } from '../../../../types/calendar';
import { Button } from '../../../button/public';
import { GridView } from '../../../grid-view/public';
import { View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../../../typography/public';
import { createCalendarMonth } from '../../application/createCalendarMonth';
import { isCalendarDateDisabled } from '../../application/isCalendarDateDisabled';

const GRID_COLUMNS = 7;
const GRID_ROWS = 6;

/*** Renders a locale-aware, accessible month calendar using canonical GridView geometry. */
export const Calendar = withZoraThemeScope(CalendarInner);

/*** Connects controlled Calendar state to the shared month grid presentation. */
function CalendarInner({
  defaultDisplayedMonth,
  density = 'regular',
  disabledDates = [],
  displayedMonth: controlledDisplayedMonth,
  interactionPolicy,
  isDateDisabled,
  locale,
  maxDate,
  minDate,
  onDisplayedMonthChange,
  onSelectedDateChange,
  selectedDate,
  testID,
  weekStartsOn = 0,
}: CalendarProps) {
  const [uncontrolledDisplayedMonth, setUncontrolledDisplayedMonth] = React.useState(() =>
    startOfLocalMonth(defaultDisplayedMonth ?? selectedDate ?? minDate ?? new Date()),
  );
  const displayedMonth = startOfLocalMonth(controlledDisplayedMonth ?? uncontrolledDisplayedMonth);
  const cellSize = density === 'compact' ? 42 : 48;
  const gridWidth = cellSize * GRID_COLUMNS;
  const gridHeight = cellSize * GRID_ROWS;
  const cells = React.useMemo(
    () => createCalendarMonth(displayedMonth, weekStartsOn),
    [displayedMonth, weekStartsOn],
  );
  const gridItems = React.useMemo<readonly GridRectItem[]>(
    () =>
      cells.map((cell, index) => ({
        height: cellSize,
        id: cell.id,
        width: cellSize,
        x: (index % GRID_COLUMNS) * cellSize,
        y: Math.floor(index / GRID_COLUMNS) * cellSize,
      })),
    [cellSize, cells],
  );
  const cellsById = React.useMemo(() => new Map(cells.map((cell) => [cell.id, cell])), [cells]);
  const disabledDateIds = React.useMemo(
    () => new Set(disabledDates.map(formatCalendarDate)),
    [disabledDates],
  );
  const weekdays = React.useMemo(
    () => createWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn],
  );
  const setDisplayedMonth = React.useCallback(
    (month: Date) => {
      const nextMonth = startOfLocalMonth(month);
      if (controlledDisplayedMonth === undefined) setUncontrolledDisplayedMonth(nextMonth);
      onDisplayedMonthChange?.(nextMonth);
    },
    [controlledDisplayedMonth, onDisplayedMonthChange],
  );
  const previousMonth = addMonths(displayedMonth, -1);
  const nextMonth = addMonths(displayedMonth, 1);

  return (
    <View accessibilityLabel="Calendar" gap={density === 'compact' ? 's' : 'm'} testID={testID}>
      <View align="center" direction="row" justify="space-between">
        <Button
          disabled={!monthIntersectsRange(previousMonth, minDate, maxDate)}
          interactionPolicy={interactionPolicy}
          onPress={() => setDisplayedMonth(previousMonth)}
          size="s"
          variant="ghost"
        >
          Previous
        </Button>
        <Text accessibilityRole="header" align="center" variant="label" weight="semiBold">
          {formatMonthLabel(displayedMonth, locale)}
        </Text>
        <Button
          disabled={!monthIntersectsRange(nextMonth, minDate, maxDate)}
          interactionPolicy={interactionPolicy}
          onPress={() => setDisplayedMonth(nextMonth)}
          size="s"
          variant="ghost"
        >
          Next
        </Button>
      </View>
      <View direction="row">
        {weekdays.map((weekday) => (
          <View key={weekday.id} width={cellSize}>
            <Text align="center" emphasis="muted" variant="caption" weight="semiBold">
              {weekday.label}
            </Text>
          </View>
        ))}
      </View>
      <GridView
        contentHeight={gridHeight}
        contentWidth={gridWidth}
        height={gridHeight}
        interactionPolicy={interactionPolicy}
        items={gridItems}
        overscanPixels={0}
        renderItem={(item) => {
          const cell = cellsById.get(item.id);
          if (!cell) return null;
          const selected =
            selectedDate !== null &&
            selectedDate !== undefined &&
            isSameLocalDay(selectedDate, cell.date);
          const disabled = isCalendarDateDisabled({
            date: cell.date,
            disabledDateIds,
            isDateDisabled,
            maxDate,
            minDate,
          });
          const selectCell = () => {
            if (!cell.inDisplayedMonth) setDisplayedMonth(cell.date);
            onSelectedDateChange?.(cell.date);
          };
          return (
            <Button
              accessibilityState={{ disabled, selected }}
              color={selected ? 'primary' : 'neutral'}
              disabled={disabled}
              interactionPolicy={interactionPolicy}
              onPress={selectCell}
              size="s"
              testID={testID ? `${testID}-day-${cell.id}` : undefined}
              variant={selected ? 'solid' : cell.inDisplayedMonth ? 'ghost' : 'outline'}
            >
              {cell.date.getDate()}
            </Button>
          );
        }}
        testID={testID ? `${testID}-grid` : undefined}
        viewportInteraction="locked"
        width={gridWidth}
      />
    </View>
  );
}

/*** Produces the ordered weekday labels for one local calendar week. */
function createWeekdayLabels(locale: string | undefined, weekStartsOn: number) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2023, 0, 1);
  return Array.from({ length: GRID_COLUMNS }, (_, index) => {
    const day = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + ((weekStartsOn + index) % GRID_COLUMNS),
    );
    return { id: String(index), label: formatter.format(day) };
  });
}

/*** Moves a local month without carrying a day-of-month overflow into the target month. */
function addMonths(month: Date, count: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + count, 1);
}

/*** Normalizes a value to the first local day of its month. */
function startOfLocalMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

/*** Formats a Date as a timezone-independent local calendar identifier. */
function formatCalendarDate(value: Date): string {
  const year = String(value.getFullYear()).padStart(4, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/*** Compares local calendar dates using their canonical date-only identifiers. */
function compareLocalDates(left: Date, right: Date): number {
  return formatCalendarDate(left).localeCompare(formatCalendarDate(right));
}

/*** Reports whether a candidate month contains at least one date inside the configured range. */
function monthIntersectsRange(
  month: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  const first = startOfLocalMonth(month);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  return (
    (!minDate || compareLocalDates(last, minDate) >= 0) &&
    (!maxDate || compareLocalDates(first, maxDate) <= 0)
  );
}

/*** Reports whether two values identify the same local calendar day. */
function isSameLocalDay(left: Date, right: Date): boolean {
  return formatCalendarDate(left) === formatCalendarDate(right);
}

/*** Formats a display month with the caller's locale. */
function formatMonthLabel(value: Date, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(value);
}
