import { Radio } from '@ankhorage/surface';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Stack } from '../../features/layout/public';
import { Text } from '../../features/typography/public';
import { useZoraThemeRecipe } from '../../theme/useZoraThemeRecipe';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { RadioOptionControl } from './RadioOptionControl';
import { resolveRadioGroupThemeRecipe } from './resolveRadioGroupThemeRecipe';
import type { RadioGroupProps } from './types';

/*** Present one controlled single-choice group as inline radios or icon radio options. */
export const RadioGroup = withZoraThemeScope(RadioGroupInner);

/*** Resolve shared presentation once and preserve a single interaction boundary per option. */
function RadioGroupInner<TValue extends string>({
  themeId: _themeId,
  mode: _mode,
  ...props
}: RadioGroupProps<TValue>) {
  const [localValue, setLocalValue] = React.useState(props.defaultValue);
  const onValueChange = (next: TValue) => {
    if (props.value === undefined) setLocalValue(next);
    props.onValueChange?.(next);
  };
  const selectedProps = { ...props, value: props.value ?? localValue, onValueChange };
  const themeFields = useZoraThemeRecipe('RadioGroup');
  const recipe = resolveRadioGroupThemeRecipe({ ...props, themeFields });
  if (props.presentation !== 'card') return <RadioGroupInline {...selectedProps} {...recipe} />;
  const columns =
    props.columns ?? (props.orientation === 'horizontal' ? Math.max(1, props.options.length) : 1);
  const rows = Array.from({ length: Math.ceil(props.options.length / columns) }, (_, index) =>
    props.options.slice(index * columns, (index + 1) * columns),
  );
  return (
    <View testID={props.testID} accessibilityRole="radiogroup">
      <Stack gap={recipe.gap}>
        {rows.map((options, index) => (
          <Stack key={index} direction="row" gap={recipe.gap}>
            {options.map((option) => (
              <View key={option.value} style={styles.option}>
                <RadioGroupItem {...selectedProps} {...recipe} option={option} />
              </View>
            ))}
            {Array.from({ length: columns - options.length }, (_, slot) => (
              <View key={`empty-${slot}`} style={styles.option} />
            ))}
          </Stack>
        ))}
      </Stack>
    </View>
  );
}

/*** Preserve ordinary radio wrapping independently of the icon-option grid. */
function RadioGroupInline<TValue extends string>(props: RadioGroupProps<TValue>) {
  return (
    <View testID={props.testID} accessibilityRole="radiogroup">
      <Stack
        direction={props.orientation === 'horizontal' ? 'row' : 'column'}
        gap={props.gap}
        wrap="wrap"
      >
        {props.options.map((option) => (
          <RadioGroupItem key={option.value} {...props} option={option} />
        ))}
      </Stack>
    </View>
  );
}

/*** Delegate icon options to their composed radio boundary and ordinary options to Surface Radio. */
function RadioGroupItem<TValue extends string>(
  props: RadioGroupProps<TValue> & {
    option: RadioGroupProps<TValue>['options'][number];
  },
) {
  const { option, value, onValueChange, interactionPolicy, color, size } = props;
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
      <Stack gap="xs">
        <Text>{option.label}</Text>
        {option.description ? (
          <Text emphasis="muted" variant="caption">
            {option.description}
          </Text>
        ) : null}
      </Stack>
    </Radio>
  );
}

const styles = StyleSheet.create({ option: { flex: 1, minWidth: 0 } });
