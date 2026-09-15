import React from 'react';

import type { DatePickerProps } from '../../../types/date-picker';
import { Button } from '../../button/public';
import { View } from '../../layout/public';
import { Text } from '../../typography/public';
import { formatLocalDate, parseLocalDate } from '../utils/localDate';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_CELL_WIDTH = 42;

/*** Renders the shared calendar content used by native BottomSheet and web Popover hosts. */
export function DatePickerContent({
  description,
  interactionPolicy,
  label,
  maxDate,
  minDate,
  onDismiss,
  onSelect,
  testID,
  value,
}: DatePickerContentProps) {
  const [displayMonth, setDisplayMonth] = React.useState(() => resolveInitialMonth(value, minDate));
  const monthDays = React.useMemo(() => createMonthDays(displayMonth), [displayMonth]);
  const resolvedMaxDate = React.useMemo(() => parseLocalDate(maxDate), [maxDate]);
  const resolvedMinDate = React.useMemo(() => parseLocalDate(minDate), [minDate]);

  return (
    <View gap="m" p="m" testID={testID ? `${testID}-content` : undefined}>
      <PickerHeader description={description} title={label ?? 'Choose date'} />
      <DatePickerMonthNavigation
        displayMonth={displayMonth}
        interactionPolicy={interactionPolicy}
        maxDate={resolvedMaxDate}
        minDate={resolvedMinDate}
        onMonthChange={setDisplayMonth}
      />
      <DatePickerWeekdays />
      <DatePickerCalendar
        interactionPolicy={interactionPolicy}
        maxDate={resolvedMaxDate}
        minDate={resolvedMinDate}
        monthDays={monthDays}
        onSelect={onSelect}
        testID={testID}
        value={value}
      />
      <Button fullWidth interactionPolicy={interactionPolicy} onPress={onDismiss} variant="ghost">
        Cancel
      </Button>
    </View>
  );
}

interface DatePickerContentProps extends Pick<
  DatePickerProps,
  'description' | 'interactionPolicy' | 'label' | 'maxDate' | 'minDate' | 'testID' | 'value'
> {
  onDismiss: () => void;
  onSelect: (value: Date) => void;
}

/*** Renders the shared title block used by picker overlays. */
function PickerHeader({
  description,
  title,
}: {
  description: React.ReactNode | undefined;
  title: React.ReactNode;
}) {
  return (
    <View gap="xxs">
      <Text align="center" variant="label" weight="semiBold">
        {title}
      </Text>
      {description ? (
        <Text align="center" emphasis="muted" variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

/*** Renders previous and next month controls for the calendar. */
function DatePickerMonthNavigation({
  displayMonth,
  interactionPolicy,
  maxDate,
  minDate,
  onMonthChange,
}: {
  displayMonth: Date;
  interactionPolicy: DatePickerProps['interactionPolicy'];
  maxDate: Date | undefined;
  minDate: Date | undefined;
  onMonthChange: (month: Date) => void;
}) {
  const previousMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1);
  const nextMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);

  return (
    <View align="center" direction="row" justify="space-between">
      <Button
        disabled={!canNavigateToMonth(previousMonth, minDate, maxDate)}
        interactionPolicy={interactionPolicy}
        onPress={() => onMonthChange(previousMonth)}
        size="s"
        variant="ghost"
      >
        Previous
      </Button>
      <Text align="center" variant="label" weight="semiBold">
        {formatMonthLabel(displayMonth)}
      </Text>
      <Button
        disabled={!canNavigateToMonth(nextMonth, minDate, maxDate)}
        interactionPolicy={interactionPolicy}
        onPress={() => onMonthChange(nextMonth)}
        size="s"
        variant="ghost"
      >
        Next
      </Button>
    </View>
  );
}

/*** Renders weekday headings for the calendar grid. */
function DatePickerWeekdays() {
  return (
    <View direction="row" justify="space-between">
      {WEEKDAY_LABELS.map((weekday) => (
        <View key={weekday} width={DAY_CELL_WIDTH}>
          <Text align="center" emphasis="muted" variant="caption" weight="semiBold">
            {weekday}
          </Text>
        </View>
      ))}
    </View>
  );
}

/*** Renders selectable day cells for the current calendar month. */
function DatePickerCalendar({
  interactionPolicy,
  maxDate,
  minDate,
  monthDays,
  onSelect,
  testID,
  value,
}: {
  interactionPolicy: DatePickerProps['interactionPolicy'];
  maxDate: Date | undefined;
  minDate: Date | undefined;
  monthDays: readonly (Date | null)[];
  onSelect: (value: Date) => void;
  testID: string | undefined;
  value: DatePickerProps['value'];
}) {
  return (
    <View direction="row" gap="xs" wrap="wrap">
      {monthDays.map((day, index) => {
        if (!day) return <View key={`empty-${index}`} width={DAY_CELL_WIDTH} />;
        const selected = isSameLocalDay(value, day);
        return (
          <View key={day.toISOString()} width={DAY_CELL_WIDTH}>
            <Button
              color={selected ? 'primary' : 'neutral'}
              disabled={isDateDisabled(day, minDate, maxDate)}
              interactionPolicy={interactionPolicy}
              onPress={() => onSelect(day)}
              size="s"
              testID={testID ? `${testID}-day-${day.getDate()}` : undefined}
              variant={selected ? 'solid' : 'ghost'}
            >
              {day.getDate()}
            </Button>
          </View>
        );
      })}
    </View>
  );
}

/*** Compares a serialized date to one local calendar day. */
function isSameLocalDay(left: string | null, right: Date): boolean {
  return left === formatLocalDate(right);
}

/*** Normalizes a Date to the start of its local calendar day. */
function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/*** Reports whether one local calendar day precedes another. */
function isBeforeLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() < startOfLocalDay(right).getTime();
}

/*** Reports whether one local calendar day follows another. */
function isAfterLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() > startOfLocalDay(right).getTime();
}

/*** Reports whether a date falls outside the configured picker range. */
function isDateDisabled(
  value: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  if (minDate && isBeforeLocalDay(value, minDate)) return true;
  if (maxDate && isAfterLocalDay(value, maxDate)) return true;
  return false;
}

/*** Formats the current calendar month for the picker heading. */
function formatMonthLabel(value: Date): string {
  return value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/*** Builds the padded calendar grid for one month. */
function createMonthDays(month: Date): (Date | null)[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const populatedLength = firstDay.getDay() + dayCount;
  const paddedLength = Math.ceil(populatedLength / 7) * 7;

  return Array.from({ length: paddedLength }, (_, index) =>
    index < firstDay.getDay()
      ? null
      : new Date(month.getFullYear(), month.getMonth(), index - firstDay.getDay() + 1),
  );
}

/*** Resolves the month initially shown by the calendar. */
function resolveInitialMonth(value: string | null, minDate: string | undefined): Date {
  const base = parseLocalDate(value) ?? parseLocalDate(minDate) ?? new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

/*** Reports whether the configured range intersects a candidate month. */
function canNavigateToMonth(
  month: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  if (maxDate && isAfterLocalDay(firstDay, maxDate)) return false;
  if (minDate && isBeforeLocalDay(lastDay, minDate)) return false;
  return true;
}
