import { Radio } from '@ankhorage/surface';
import React from 'react';
import type { Pressable } from 'react-native';
import { StyleSheet } from 'react-native';

import type { RadioGroupProps } from '../../../../../types/radio';
import type { ReactNativeComponentInstance } from '../../../../../types/react-native';
import { View } from '../../../../layout/public';
import { withZoraThemeScope } from '../../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraThemeRecipe } from '../../../../theme/composition/useZoraThemeRecipe';
import { Text } from '../../../../typography/public';
import { radioGroupThemeRecipeMeta } from '../../themeRecipeMeta';
import { resolveRadioGroupThemeRecipe } from '../../utils/resolveRadioGroupThemeRecipe';
import { RadioOptionControl } from './RadioOptionControl';

/*** Present one controlled single-choice group as inline radios or icon radio options. */
export const RadioGroup = withZoraThemeScope(RadioGroupInner);

/*** Resolve shared presentation once and preserve a single interaction boundary per option. */
function RadioGroupInner<TValue extends string>({
  themeId: _themeId,
  mode: _mode,
  ...props
}: RadioGroupProps<TValue>) {
  const [localValue, setLocalValue] = React.useState(props.defaultValue);
  const cardOptionRefs = React.useRef<Map<TValue, ReactNativeComponentInstance<typeof Pressable>>>(
    new Map(),
  );
  const onValueChange = (next: TValue) => {
    if (props.value === undefined) setLocalValue(next);
    props.onValueChange?.(next);
  };
  const onNavigateCardOption = (currentValue: TValue, direction: -1 | 1) => {
    const currentIndex = props.options.findIndex((option) => option.value === currentValue);
    if (currentIndex < 0) return;
    const nextOption = Array.from({ length: props.options.length - 1 }, (_, offset) =>
      props.options.at(
        (currentIndex + direction * (offset + 1) + props.options.length) % props.options.length,
      ),
    ).find((option) => option !== undefined && !props.disabled && !option.disabled);
    if (nextOption === undefined) return;
    onValueChange(nextOption.value);
    cardOptionRefs.current.get(nextOption.value)?.focus();
  };
  const onCardOptionRef = (
    value: TValue,
    element: ReactNativeComponentInstance<typeof Pressable> | null,
  ) => {
    if (element === null) cardOptionRefs.current.delete(value);
    else cardOptionRefs.current.set(value, element);
  };
  const selectedProps = { ...props, value: props.value ?? localValue, onValueChange };
  const themeFields = useZoraThemeRecipe(radioGroupThemeRecipeMeta);
  const recipe = resolveRadioGroupThemeRecipe({ ...props, themeFields });
  if (props.presentation !== 'card') return <RadioGroupInline {...selectedProps} {...recipe} />;
  const columns =
    props.columns ?? (props.orientation === 'horizontal' ? Math.max(1, props.options.length) : 1);
  const rows = Array.from({ length: Math.ceil(props.options.length / columns) }, (_, index) =>
    props.options.slice(index * columns, (index + 1) * columns),
  );
  return (
    <View testID={props.testID} accessibilityRole="radiogroup">
      <View gap={recipe.gap}>
        {rows.map((options, index) => (
          <View key={index} direction="row" gap={recipe.gap}>
            {options.map((option) => (
              <View key={option.value} style={styles.option}>
                <RadioGroupItem
                  {...selectedProps}
                  {...recipe}
                  onNavigate={onNavigateCardOption}
                  onOptionRef={onCardOptionRef}
                  option={option}
                />
              </View>
            ))}
            {Array.from({ length: columns - options.length }, (_, slot) => (
              <View key={`empty-${slot}`} style={styles.option} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/*** Preserve ordinary radio wrapping independently of the icon-option grid. */
function RadioGroupInline<TValue extends string>(props: RadioGroupProps<TValue>) {
  return (
    <View testID={props.testID} accessibilityRole="radiogroup">
      <View
        direction={props.orientation === 'horizontal' ? 'row' : 'column'}
        gap={props.gap}
        wrap="wrap"
      >
        {props.options.map((option) => (
          <RadioGroupItem key={option.value} {...props} option={option} />
        ))}
      </View>
    </View>
  );
}

/*** Delegate icon options to their composed radio boundary and ordinary options to Surface Radio. */
function RadioGroupItem<TValue extends string>(
  props: RadioGroupProps<TValue> & {
    onNavigate?: (currentValue: TValue, direction: -1 | 1) => void;
    onOptionRef?: (
      value: TValue,
      element: ReactNativeComponentInstance<typeof Pressable> | null,
    ) => void;
    option: RadioGroupProps<TValue>['options'][number];
  },
) {
  const { option, value, onValueChange, interactionPolicy, color, size, onNavigate, onOptionRef } =
    props;
  const checked = value === option.value;
  const inactive = props.disabled === true || option.disabled === true;
  const readOnly = props.readOnly === true;
  const invalid = props.invalid === true;
  const onSelect = () => {
    if (!inactive && !readOnly && interactionPolicy !== 'passive' && !checked)
      onValueChange?.(option.value);
  };
  if (props.presentation === 'card') {
    return (
      <RadioOptionControl
        {...props}
        checked={checked}
        disabled={inactive}
        readOnly={readOnly}
        invalid={invalid}
        layout={props.contentOrientation ?? 'horizontal'}
        onNavigate={(direction) => onNavigate?.(option.value, direction)}
        onOptionRef={(element) => onOptionRef?.(option.value, element)}
        onSelect={onSelect}
      />
    );
  }
  return (
    <Radio
      checked={checked}
      disabled={inactive}
      readOnly={readOnly}
      invalid={invalid}
      interactionPolicy={interactionPolicy}
      color={color}
      size={size}
      testID={option.testID}
      onCheckedChange={onSelect}
    >
      <View gap="xs">
        <Text>{option.label}</Text>
        {option.description ? (
          <Text emphasis="muted" variant="caption">
            {option.description}
          </Text>
        ) : null}
      </View>
    </Radio>
  );
}

const styles = StyleSheet.create({ option: { flex: 1, minWidth: 0 } });
