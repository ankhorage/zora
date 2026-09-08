import { Radio, useTheme } from '@ankhorage/surface';
import React from 'react';
import { View } from 'react-native';

import { Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Text } from '../text';
import type { RadioGroupOption, RadioGroupProps } from './types';

/***
 * Resolves the themed radio-group presentation within the active ZORA scope.
 */
function RadioGroupInner<TValue extends string>({
  themeId: _themeId,
  mode: _mode,
  value,
  onValueChange,
  options,
  orientation = 'vertical',
  gap = 's',
  presentation = 'inline',
  color = 'primary',
  size = 'm',
  invalid = false,
  readOnly = false,
  disabled = false,
  testID,
  interactionPolicy,
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
            color={color}
            orientation={orientation}
            presentation={presentation}
            onSelect={onValueChange}
            interactionPolicy={interactionPolicy}
          />
        ))}
      </Stack>
    </View>
  );
}

/***
 * Renders a group of radio options for selecting a single value.
 */
export const RadioGroup = withZoraThemeScope(RadioGroupInner);

/***
 * Renders one option through the single Surface Radio interaction boundary.
 */
function RadioGroupItem<TValue extends string>({
  option,
  checked,
  disabled,
  invalid,
  readOnly,
  size,
  color,
  orientation,
  presentation,
  onSelect,
  interactionPolicy,
}: {
  option: RadioGroupOption<TValue>;
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  size: NonNullable<RadioGroupProps<TValue>['size']>;
  color: NonNullable<RadioGroupProps<TValue>['color']>;
  orientation: NonNullable<RadioGroupProps<TValue>['orientation']>;
  presentation: NonNullable<RadioGroupProps<TValue>['presentation']>;
  onSelect: (value: TValue) => void;
  interactionPolicy: RadioGroupProps<TValue>['interactionPolicy'];
}) {
  const { theme } = useTheme();
  const passive = interactionPolicy === 'passive';
  const isCard = presentation === 'card';

  return (
    <Radio
      interactionPolicy={interactionPolicy}
      checked={checked}
      disabled={disabled}
      invalid={invalid}
      readOnly={readOnly}
      size={size}
      color={color}
      testID={option.testID}
      bg={isCard ? (checked ? theme.semantics.selection.background : theme.semantics.surface.default) : undefined}
      borderColor={isCard ? (checked ? theme.semantics.selection.border : theme.semantics.border.default) : undefined}
      borderWidth={isCard ? 1 : undefined}
      p={isCard ? 'm' : undefined}
      radius={isCard ? 'l' : undefined}
      width={isCard && orientation === 'vertical' ? '100%' : undefined}
      onCheckedChange={(nextChecked) => {
        if (passive) return;
        if (nextChecked) onSelect(option.value);
      }}
    >
      <Stack gap="xs">
        <Text weight={isCard ? 'semiBold' : undefined}>{option.label}</Text>
        {option.description ? (
          <Text emphasis="muted" variant="caption">
            {option.description}
          </Text>
        ) : null}
      </Stack>
    </Radio>
  );
}
