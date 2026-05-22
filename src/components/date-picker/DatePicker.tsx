import { Field } from '@ankhorage/surface';
import React from 'react';

import { Box, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { ActionSheet } from '../action-sheet';
import { Button } from '../button';
import { Text } from '../text';
import type { DatePickerProps } from './types';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_CELL_WIDTH = 42;

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

function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function isSameLocalDay(left: Date | null, right: Date): boolean {
  if (!left) {
    return false;
  }

  return startOfLocalDay(left).getTime() === startOfLocalDay(right).getTime();
}

function isBeforeLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() < startOfLocalDay(right).getTime();
}

function isAfterLocalDay(left: Date, right: Date): boolean {
  return startOfLocalDay(left).getTime() > startOfLocalDay(right).getTime();
}

function isDateDisabled(
  value: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  if (minDate && isBeforeLocalDay(value, minDate)) {
    return true;
  }

  if (maxDate && isAfterLocalDay(value, maxDate)) {
    return true;
  }

  return false;
}

function formatMonthLabel(value: Date): string {
  return value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatDefaultDate(value: Date): string {
  return value.toLocaleDateString();
}

function createMonthDays(month: Date): (Date | null)[] {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days: (Date | null)[] = [];

  for (let offset = 0; offset < firstDay.getDay(); offset += 1) {
    days.push(null);
  }

  for (let day = 1; day <= dayCount; day += 1) {
    days.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function resolveInitialMonth(value: Date | null, minDate: Date | undefined): Date {
  const base = value ?? minDate ?? new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

function canNavigateToMonth(
  month: Date,
  minDate: Date | undefined,
  maxDate: Date | undefined,
): boolean {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  if (maxDate && isAfterLocalDay(firstDay, maxDate)) {
    return false;
  }

  if (minDate && isBeforeLocalDay(lastDay, minDate)) {
    return false;
  }

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
}: DatePickerProps) {
  const [visible, setVisible] = React.useState(false);
  const [displayMonth, setDisplayMonth] = React.useState(() => resolveInitialMonth(value, minDate));
  const monthDays = React.useMemo(() => createMonthDays(displayMonth), [displayMonth]);
  const previousMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1);
  const nextMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1);
  const displayValue = value
    ? formatDate
      ? formatDate(value)
      : formatDefaultDate(value)
    : placeholder;

  React.useEffect(() => {
    if (visible) {
      setDisplayMonth(resolveInitialMonth(value, minDate));
    }
  }, [minDate, value, visible]);

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
        onPress={() => setVisible(true)}
        testID={testID ? `${testID}-trigger` : undefined}
        trailingIcon={{ name: 'calendar-outline' }}
        variant="outline"
      >
        {displayValue}
      </Button>
      <ActionSheet
        description={description}
        onDismiss={() => setVisible(false)}
        testID={testID ? `${testID}-sheet` : undefined}
        title={label ?? 'Choose date'}
        visible={visible}
      >
        <Stack gap="m">
          <Stack align="center" direction="row" justify="space-between">
            <Button
              disabled={!canNavigateToMonth(previousMonth, minDate, maxDate)}
              onPress={() => setDisplayMonth(previousMonth)}
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
              onPress={() => setDisplayMonth(nextMonth)}
              size="s"
              variant="ghost"
            >
              Next
            </Button>
          </Stack>

          <Stack direction="row" justify="space-between">
            {WEEKDAY_LABELS.map((weekday) => (
              <Box key={weekday} style={{ width: DAY_CELL_WIDTH }}>
                <Text align="center" emphasis="muted" variant="caption" weight="semiBold">
                  {weekday}
                </Text>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" gap="xs" style={{ flexWrap: 'wrap' }}>
            {monthDays.map((day, index) => {
              if (!day) {
                return <Box key={`empty-${index}`} style={{ width: DAY_CELL_WIDTH }} />;
              }

              const selected = isSameLocalDay(value, day);
              const dayDisabled = isDateDisabled(day, minDate, maxDate);

              return (
                <Box key={day.toISOString()} style={{ width: DAY_CELL_WIDTH }}>
                  <Button
                    color={selected ? 'primary' : 'neutral'}
                    disabled={dayDisabled}
                    onPress={() => {
                      onValueChange?.(startOfLocalDay(day));
                      setVisible(false);
                    }}
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
        </Stack>
      </ActionSheet>
    </Field>
  );
}

/***
 * Date input control with calendar selection and formatted display value.
 *
 * @readme
 */
export const DatePicker = withZoraThemeScope(DatePickerInner);
