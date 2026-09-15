import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import type { TimePickerProps } from '../../../types/time-picker';
import { Button } from '../../button/public';
import { View } from '../../layout/public';
import { Text } from '../../typography/public';

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_STEP_MINUTES = 30;

/*** Renders shared time options for native BottomSheet and web Popover hosts. */
export function TimePickerContent({
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
}: TimePickerContentProps) {
  const options = React.useMemo(
    () => generateTimeOptions({ maxTime, minTime, stepMinutes }),
    [maxTime, minTime, stepMinutes],
  );

  return (
    <View gap="m" p="m" testID={testID ? `${testID}-content` : undefined}>
      <PickerHeader description={description} title={label ?? 'Choose time'} />
      <ScrollView style={styles.options}>
        <View gap="xxs">
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
        </View>
      </ScrollView>
      <Button fullWidth interactionPolicy={interactionPolicy} onPress={onDismiss} variant="ghost">
        Cancel
      </Button>
    </View>
  );
}

interface TimePickerContentProps extends Pick<
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

/*** Renders one accessible selectable time option. */
function TimePickerOption({
  formatTime,
  interactionPolicy,
  onSelect,
  option,
  selected,
  testID,
}: Pick<TimePickerContentProps, 'formatTime' | 'interactionPolicy' | 'testID'> & {
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

/*** Parses one HH:mm value to minutes since midnight. */
function parseTimeToMinutes(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return undefined;
  return hours * 60 + minutes;
}

/*** Formats minutes since midnight as HH:mm. */
function formatMinutes(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/*** Normalizes the configured time step to a positive whole minute. */
function resolveStepMinutes(stepMinutes: number | undefined): number {
  if (stepMinutes === undefined || !Number.isFinite(stepMinutes) || stepMinutes <= 0) {
    return DEFAULT_STEP_MINUTES;
  }
  return Math.max(1, Math.floor(stepMinutes));
}

/*** Generates selectable HH:mm values within the configured range. */
function generateTimeOptions({
  minTime,
  maxTime,
  stepMinutes,
}: Pick<TimePickerProps, 'maxTime' | 'minTime' | 'stepMinutes'>): string[] {
  const step = resolveStepMinutes(stepMinutes);
  const min = parseTimeToMinutes(minTime) ?? 0;
  const max = parseTimeToMinutes(maxTime) ?? MINUTES_PER_DAY - 1;
  return Array.from({ length: Math.ceil(MINUTES_PER_DAY / step) }, (_, index) => index * step)
    .filter((minute) => minute >= min && minute <= max)
    .map(formatMinutes);
}

const styles = StyleSheet.create({
  options: { maxHeight: 360 },
});
