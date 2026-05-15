import { Checkbox } from '@ankhorage/surface';
import React from 'react';
import { View } from 'react-native';

import { Stack } from '../../foundation';
import { resolveZoraColorToSurfaceTone, type ZoraColor } from '../../internal/recipes';
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
  color = 'primary',
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
            color={color}
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
  color,
  value,
  onValueChange,
}: {
  option: CheckboxGroupOption<TValue>;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  size: NonNullable<CheckboxGroupProps<TValue>['size']>;
  color: ZoraColor;
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
      tone={resolveZoraColorToSurfaceTone(color)}
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
          <Text variant="caption" color="muted">
            {option.description}
          </Text>
        ) : null}
      </Stack>
    </Checkbox>
  );
}
