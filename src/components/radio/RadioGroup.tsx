import { Radio, Stack, Text } from '@ankhorage/surface';
import React from 'react';
import { View } from 'react-native';

import type { RadioGroupOption, RadioGroupProps } from './types';

export function RadioGroup<TValue extends string>({
  value,
  onValueChange,
  options,
  orientation = 'vertical',
  gap = 's',
  tone = 'primary',
  size = 'm',
  invalid = false,
  readOnly = false,
  disabled = false,
  testID,
}: RadioGroupProps<TValue>) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      testID={testID}
      accessibilityRole="radiogroup"
      style={{
        flexDirection: isHorizontal ? 'row' : 'column',
        flexWrap: isHorizontal ? 'wrap' : 'nowrap',
      }}
    >
      <Stack
        direction={isHorizontal ? 'row' : 'column'}
        gap={gap}
        wrap={isHorizontal ? 'wrap' : 'nowrap'}
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            option={option}
            checked={value === option.value}
            disabled={disabled || option.disabled === true}
            invalid={invalid}
            readOnly={readOnly}
            size={size}
            tone={tone}
            onSelect={onValueChange}
          />
        ))}
      </Stack>
    </View>
  );
}

function RadioGroupItem<TValue extends string>({
  option,
  checked,
  disabled,
  invalid,
  readOnly,
  size,
  tone,
  onSelect,
}: {
  option: RadioGroupOption<TValue>;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  size: NonNullable<RadioGroupProps<TValue>['size']>;
  tone: NonNullable<RadioGroupProps<TValue>['tone']>;
  onSelect: (value: TValue) => void;
}) {
  return (
    <Radio
      checked={checked}
      disabled={disabled}
      invalid={invalid}
      readOnly={readOnly}
      size={size}
      tone={tone}
      testID={option.testID}
      onCheckedChange={(nextChecked) => {
        if (nextChecked) onSelect(option.value);
      }}
    >
      <Stack gap="xs">
        <Text>{option.label}</Text>
        {option.description ? (
          <Text variant="caption" tone="muted">
            {option.description}
          </Text>
        ) : null}
      </Stack>
    </Radio>
  );
}
