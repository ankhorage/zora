import { Checkbox, Stack } from '@ankhorage/surface';
import React from 'react';
import { View } from 'react-native';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Text } from '../text';
import type { CheckboxGroupOption, CheckboxGroupProps } from './types';

function CheckboxGroupInner<TValue extends string>({
  themeId: _themeId,
  mode: _mode,
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
}: CheckboxGroupProps<TValue>) {
  const selectedValues = new Set(value);
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      testID={testID}
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
          <CheckboxGroupItem
            key={option.value}
            option={option}
            checked={selectedValues.has(option.value)}
            disabled={disabled || option.disabled === true}
            invalid={invalid}
            readOnly={readOnly}
            size={size}
            tone={tone}
            value={value}
            onValueChange={onValueChange}
          />
        ))}
      </Stack>
    </View>
  );
}

export const CheckboxGroup = withZoraThemeScope(CheckboxGroupInner);

function CheckboxGroupItem<TValue extends string>({
  option,
  checked,
  disabled,
  invalid,
  readOnly,
  size,
  tone,
  value,
  onValueChange,
}: {
  option: CheckboxGroupOption<TValue>;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  size: NonNullable<CheckboxGroupProps<TValue>['size']>;
  tone: NonNullable<CheckboxGroupProps<TValue>['tone']>;
  value: readonly TValue[];
  onValueChange: (value: TValue[]) => void;
}) {
  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      invalid={invalid}
      readOnly={readOnly}
      size={size}
      tone={tone}
      testID={option.testID}
      onCheckedChange={(nextChecked) => {
        const nextValue = nextChecked
          ? [...value, option.value]
          : value.filter((currentValue) => currentValue !== option.value);

        onValueChange(nextValue);
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
    </Checkbox>
  );
}
