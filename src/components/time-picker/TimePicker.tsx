import { Field } from '@ankhorage/surface';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useBottomSheet } from '../../features/bottom-sheet/public';
import { Button } from '../../features/button/public';
import { Stack } from '../../features/layout/public';
import { Text } from '../../features/typography/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { TimePickerProps } from './types';

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_STEP_MINUTES = 30;

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

/*** Parse one HH:mm value to minutes since midnight. */
function parseTimeToMinutes(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return undefined;
  return hours * 60 + minutes;
}

/*** Format minutes since midnight as HH:mm. */
function formatMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/*** Normalize the configured time step to a positive whole minute. */
function resolveStepMinutes(stepMinutes: number | undefined): number {
  if (stepMinutes === undefined || !Number.isFinite(stepMinutes) || stepMinutes <= 0) {
    return DEFAULT_STEP_MINUTES;
  }
  return Math.max(1, Math.floor(stepMinutes));
}

/*** Generate selectable HH:mm values within the configured range. */
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
    if (minute >= min && minute <= max) options.push(formatMinutes(minute));
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
  interactionPolicy,
}: TimePickerProps) {
  const { dismiss, present } = useBottomSheet();
  const passive = interactionPolicy === 'passive';
  const displayValue = value ? (formatTime ? formatTime(value) : value) : placeholder;

  /*** Present the time options through the shared BottomSheet controller. */
  function openPicker() {
    if (passive) return;
    present({
      content: (
        <TimePickerSheet
          description={description}
          formatTime={formatTime}
          interactionPolicy={interactionPolicy}
          label={label}
          maxTime={maxTime}
          minTime={minTime}
          onDismiss={dismiss}
          onSelect={(time) => {
            onValueChange?.(time);
            dismiss();
          }}
          stepMinutes={stepMinutes}
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
        trailingIcon={{ name: 'chevron-down-outline' }}
        variant="outline"
      >
        {displayValue}
      </Button>
    </Field>
  );
}

interface TimePickerSheetProps extends Pick<
  TimePickerProps,
  | 'description'
  | 'formatTime'
  | 'interactionPolicy'
  | 'label'
  | 'maxTime'
  | 'minTime'
  | 'stepMinutes'
  | 'testID'
  | 'value'
> {
  onDismiss: () => void;
  onSelect: (value: string) => void;
}

/*** Render time selection content inside the shared BottomSheet host. */
function TimePickerSheet({
  description,
  formatTime,
  interactionPolicy,
  label,
  maxTime,
  minTime,
  onDismiss,
  onSelect,
  stepMinutes,
  testID,
  value,
}: TimePickerSheetProps) {
  const options = React.useMemo(
    () => generateTimeOptions({ maxTime, minTime, stepMinutes }),
    [maxTime, minTime, stepMinutes],
  );

  return (
    <Stack gap="m" p="m" testID={testID ? `${testID}-sheet` : undefined}>
      <PickerSheetHeader description={description} title={label ?? 'Choose time'} />
      <ScrollView style={styles.options}>
        <Stack gap="xxs">
          {options.map((option) => (
            <TimePickerOption
              formatTime={formatTime}
              interactionPolicy={interactionPolicy}
              key={option}
              onSelect={onSelect}
              option={option}
              selected={option === value}
              testID={testID}
            />
          ))}
        </Stack>
      </ScrollView>
      <Button fullWidth interactionPolicy={interactionPolicy} onPress={onDismiss} variant="ghost">
        Cancel
      </Button>
    </Stack>
  );
}

/*** Render the shared title block used by the time sheet. */
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

/*** Render one accessible selectable time option. */
function TimePickerOption({
  formatTime,
  interactionPolicy,
  onSelect,
  option,
  selected,
  testID,
}: Pick<TimePickerSheetProps, 'formatTime' | 'interactionPolicy' | 'testID'> & {
  onSelect: (value: string) => void;
  option: string;
  selected: boolean;
}) {
  return (
    <Button
      accessibilityState={{ selected }}
      fullWidth
      interactionPolicy={interactionPolicy}
      onPress={() => onSelect(option)}
      testID={testID ? `${testID}-option-${option}` : undefined}
      variant={selected ? 'soft' : 'ghost'}
    >
      {formatTime ? formatTime(option) : option}
    </Button>
  );
}

const styles = StyleSheet.create({
  options: { maxHeight: 360 },
});

/***
 * Time input control with bottom-sheet selection and formatted display value.
 */
export const TimePicker = withZoraThemeScope(TimePickerInner);
