import { Field } from '@ankhorage/surface';
import React from 'react';

import { useBottomSheet } from '../../features/bottom-sheet/public';
import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Button } from '../button';
import { Text } from '../text';
import type { DatePickerProps } from './types';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_CELL_WIDTH = 42;

/*** Render the field label and optional supporting description. */
function renderLabel(label: React.ReactNode, description: React.ReactNode | undefined) {
  return (
    <Stack gap="xs">
      <Text variant="label" weight="semiBold">
        {label}
      </Text>
      {description ? (
        <Text emphasis="muted" variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </Stack>
  );
}

/*** Normalize a date to the start of its local calendar day. */
function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

/*** Compare two values by local calendar day. */
function isSameLocalDay(left: Date | null, right: Date): boolean {
  if (!left) return false;
  return startOfLocalDay(left).getTime() === startOfLocalDay(right).getTime();
}

/*** Report whether one local calendar day precedes another. */
function isBeforeLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() < startOfLocalDay(right).getTime();
}

/*** Report whether one local calendar day follows another. */
function isAfterLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() > startOfLocalDay(right).getTime();
}

/*** Resolve whether a date falls outside the configured picker range. */
function isDateDisabled(
  value: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  if (minDate && isBeforeLocalDay(value, minDate)) return true;
  if (maxDate && isAfterLocalDay(value, maxDate)) return true;
  return false;
}

/*** Format the current calendar month for the picker heading. */
function formatMonthLabel(value: Date): string {
  return value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

/*** Format a selected date with the platform locale defaults. */
function formatDefaultDate(value: Date): string {
  return value.toLocaleDateString();
}

/*** Build the padded calendar grid for one month. */
function createMonthDays(month: Date): (Date | null)[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days: (Date | null)[] = [];

  for (let offset = 0; offset < firstDay.getDay(); offset += 1) days.push(null);
  for (let day = 1; day <= dayCount; day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

/*** Resolve the month initially shown by the calendar sheet. */
function resolveInitialMonth(value: Date | null, minDate: Date | undefined): Date {
  const base = value ?? minDate ?? new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

/*** Report whether the configured range intersects a candidate month. */
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

function DatePickerInner({
  themeId: _themeId,
  mode: _mode,
  value,
  onValueChange,
  label,
  description,
  error,
  placeholder = 'Choose date',
  minDate,
  maxDate,
  disabled = false,
  required = false,
  formatDate,
  testID,
  interactionPolicy,
}: DatePickerProps) {
  const { dismiss, present } = useBottomSheet();
  const passive = interactionPolicy === 'passive';
  const displayValue = value
    ? formatDate
      ? formatDate(value)
      : formatDefaultDate(value)
    : placeholder;

  /*** Present the calendar content through the shared BottomSheet controller. */
  function openPicker() {
    if (passive) return;
    present({
      content: (
        <DatePickerSheet
          description={description}
          interactionPolicy={interactionPolicy}
          label={label}
          maxDate={maxDate}
          minDate={minDate}
          onDismiss={dismiss}
          onSelect={(date) => {
            onValueChange?.(startOfLocalDay(date));
            dismiss();
          }}
          testID={testID}
          value={value}
        />
      ),
    });
  }

  return (
    <Field
      disabled={disabled}
      errorText={error}
      invalid={Boolean(error)}
      label={label ? renderLabel(label, description) : undefined}
      required={required}
      testID={testID}
    >
      <Button
        disabled={disabled}
        interactionPolicy={interactionPolicy}
        onPress={openPicker}
        testID={testID ? `${testID}-trigger` : undefined}
        trailingIcon={{ name: 'calendar-outline' }}
        variant="outline"
      >
        {displayValue}
      </Button>
    </Field>
  );
}

interface DatePickerSheetProps extends Pick<
  DatePickerProps,
  'description' | 'interactionPolicy' | 'label' | 'maxDate' | 'minDate' | 'testID' | 'value'
> {
  onDismiss: () => void;
  onSelect: (value: Date) => void;
}

/*** Render the calendar-specific content inside the shared BottomSheet host. */
function DatePickerSheet({
  description,
  interactionPolicy,
  label,
  maxDate,
  minDate,
  onDismiss,
  onSelect,
  testID,
  value,
}: DatePickerSheetProps) {
  const [displayMonth, setDisplayMonth] = React.useState(() => resolveInitialMonth(value, minDate));
  const monthDays = React.useMemo(() => createMonthDays(displayMonth), [displayMonth]);

  return (
    <Stack gap="m" p="m" testID={testID ? `${testID}-sheet` : undefined}>
      <PickerSheetHeader description={description} title={label ?? 'Choose date'} />
      <DatePickerMonthNavigation
        displayMonth={displayMonth}
        interactionPolicy={interactionPolicy}
        maxDate={maxDate}
        minDate={minDate}
        onMonthChange={setDisplayMonth}
      />
      <DatePickerWeekdays />
      <DatePickerCalendar
        interactionPolicy={interactionPolicy}
        maxDate={maxDate}
        minDate={minDate}
        monthDays={monthDays}
        onSelect={onSelect}
        testID={testID}
        value={value}
      />
      <Button fullWidth interactionPolicy={interactionPolicy} onPress={onDismiss} variant="ghost">
        Cancel
      </Button>
    </Stack>
  );
}

/*** Render the shared title block used by the calendar sheet. */
function PickerSheetHeader({
  description,
  title,
}: {
  description: React.ReactNode | undefined;
  title: React.ReactNode;
}) {
  return (
    <Stack gap="xxs">
      <Text align="center" variant="label" weight="semiBold">
        {title}
      </Text>
      {description ? (
        <Text align="center" emphasis="muted" variant="bodySmall">
          {description}
        </Text>
      ) : null}
    </Stack>
  );
}

/*** Render previous/next month controls for the calendar sheet. */
function DatePickerMonthNavigation({
  displayMonth,
  interactionPolicy,
  maxDate,
  minDate,
  onMonthChange,
}: Pick<DatePickerSheetProps, 'interactionPolicy' | 'maxDate' | 'minDate'> & {
  displayMonth: Date;
  onMonthChange: (month: Date) => void;
}) {
  const previousMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1);
  const nextMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);

  return (
    <Stack align="center" direction="row" justify="space-between">
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
    </Stack>
  );
}

/*** Render weekday headings for the calendar grid. */
function DatePickerWeekdays() {
  return (
    <Stack direction="row" justify="space-between">
      {WEEKDAY_LABELS.map((weekday) => (
        <Box key={weekday} width={DAY_CELL_WIDTH}>
          <Text align="center" emphasis="muted" variant="caption" weight="semiBold">
            {weekday}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}

/*** Render selectable day cells for the current calendar month. */
function DatePickerCalendar({
  interactionPolicy,
  maxDate,
  minDate,
  monthDays,
  onSelect,
  testID,
  value,
}: Pick<DatePickerSheetProps, 'interactionPolicy' | 'maxDate' | 'minDate' | 'testID' | 'value'> & {
  monthDays: readonly (Date | null)[];
  onSelect: (value: Date) => void;
}) {
  return (
    <Stack direction="row" gap="xs" wrap="wrap">
      {monthDays.map((day, index) => {
        if (!day) return <Box key={`empty-${index}`} width={DAY_CELL_WIDTH} />;
        const selected = isSameLocalDay(value, day);
        return (
          <Box key={day.toISOString()} width={DAY_CELL_WIDTH}>
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
          </Box>
        );
      })}
    </Stack>
  );
}

/***
 * Date input control with calendar selection and formatted display value.
 */
export const DatePicker = withZoraThemeScope(DatePickerInner);
