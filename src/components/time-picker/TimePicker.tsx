import { Field } from '@ankhorage/surface';
import React from 'react';
import { ScrollView } from 'react-native';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { ActionSheet, ActionSheetItem } from '../action-sheet';
import { Button } from '../button';
import { Text } from '../text';
import type { TimePickerProps } from './types';

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_STEP_MINUTES = 30;

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

function parseTimeToMinutes(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return undefined;
  }

  return hours * 60 + minutes;
}

function formatMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function resolveStepMinutes(stepMinutes: number | undefined): number {
  if (stepMinutes === undefined || !Number.isFinite(stepMinutes) || stepMinutes <= 0) {
    return DEFAULT_STEP_MINUTES;
  }

  return Math.max(1, Math.floor(stepMinutes));
}

function generateTimeOptions({
  minTime,
  maxTime,
  stepMinutes,
}: Pick<TimePickerProps, 'maxTime' | 'minTime' | 'stepMinutes'>): string[] {
  const step = resolveStepMinutes(stepMinutes);
  const min = parseTimeToMinutes(minTime) ?? 0;
  const max = parseTimeToMinutes(maxTime) ?? MINUTES_PER_DAY - 1;
  const options: string[] = [];

  for (let minute = 0; minute < MINUTES_PER_DAY; minute += step) {
    if (minute >= min && minute <= max) {
      options.push(formatMinutes(minute));
    }
  }

  return options;
}

function TimePickerInner({
  themeId: _themeId,
  mode: _mode,
  value,
  onValueChange,
  label,
  description,
  error,
  placeholder = 'Choose time',
  minTime,
  maxTime,
  stepMinutes,
  disabled = false,
  required = false,
  formatTime,
  testID,
}: TimePickerProps) {
  const [visible, setVisible] = React.useState(false);
  const options = React.useMemo(
    () => generateTimeOptions({ maxTime, minTime, stepMinutes }),
    [maxTime, minTime, stepMinutes],
  );
  const displayValue = value ? (formatTime ? formatTime(value) : value) : placeholder;

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
        trailingIcon={{ name: 'chevron-down-outline' }}
        variant="outline"
      >
        {displayValue}
      </Button>
      <ActionSheet
        description={description}
        onDismiss={() => setVisible(false)}
        testID={testID ? `${testID}-sheet` : undefined}
        title={label ?? 'Choose time'}
        visible={visible}
      >
        <ScrollView style={{ maxHeight: 360 }}>
          <Stack gap="xxs">
            {options.map((option) => (
              <ActionSheetItem
                key={option}
                label={formatTime ? formatTime(option) : option}
                onPress={() => {
                  onValueChange?.(option);
                  setVisible(false);
                }}
                selected={option === value}
                testID={testID ? `${testID}-option-${option}` : undefined}
              />
            ))}
          </Stack>
        </ScrollView>
      </ActionSheet>
    </Field>
  );
}

/***
 * Time input control with wheel selection and formatted display value.
 *
 
 */
export const TimePicker = withZoraThemeScope(TimePickerInner);
