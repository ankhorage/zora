import { useTheme } from '@ankhorage/surface';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '../icon';
import { Text } from '../text';
import {
  handleRadioOptionKeyDown,
  type RadioOptionKeyboardTarget,
} from './handleRadioOptionKeyDown';
import { resolveRadioOptionColors } from './resolveRadioOptionColors';
import type { RadioGroupProps } from './types';

/*** Render a selectable icon radio option with one accessible radio target and a trailing check. */
export function RadioOptionControl<TValue extends string>(props: RadioOptionControlProps<TValue>) {
  const { theme } = useTheme();
  const { option, checked, disabled, readOnly, interactionPolicy, onSelect } = props;
  const colors = resolveRadioOptionColors(theme, props);
  const [focused, setFocused] = React.useState(false);
  const keyboardProps =
    Platform.OS === 'web' && !readOnly && !disabled && interactionPolicy !== 'passive'
      ? {
          onKeyDown: (event: React.KeyboardEvent<RadioOptionKeyboardTarget>) =>
            handleRadioOptionKeyDown(event, onSelect),
        }
      : {};
  const controlStyle = {
    flex: 1,
    width: '100%' as const,
    minHeight: props.size === 'l' ? 84 : 44,
    borderWidth: checked || focused ? 2 : 1,
    borderColor: focused ? theme.semantics.border.focus : checked ? colors.accent : colors.border,
    borderRadius: theme.radii.l,
    backgroundColor: colors.surface,
  };
  return (
    <Pressable
      {...keyboardProps}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled }}
      aria-checked={checked}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      disabled={disabled}
      onPress={readOnly || interactionPolicy === 'passive' ? undefined : onSelect}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={option.testID}
      style={controlStyle}
    >
      {(state) => <RadioOptionControlBody {...props} pressed={state.pressed} />}
    </Pressable>
  );
}

/*** Arrange the icon, label and passive indicator within the native radio press target. */
function RadioOptionControlBody<TValue extends string>(
  props: RadioOptionControlProps<TValue> & { pressed: boolean },
) {
  const { theme } = useTheme();
  const colors = resolveRadioOptionColors(theme, props);
  const contentStyle = {
    padding: props.size === 's' ? theme.spacing.s : props.size === 'm' ? 12 : theme.spacing.m,
    gap:
      props.layout === 'vertical' || !props.option.iconSource ? theme.spacing.s : theme.spacing.m,
    ...(!props.option.iconSource ? { flexDirection: 'row-reverse' as const } : {}),
    opacity: props.disabled ? 0.5 : props.pressed ? 0.7 : 1,
  };
  return (
    <View
      style={[
        styles.content,
        props.layout === 'vertical' ? styles.vertical : styles.horizontal,
        contentStyle,
      ]}
    >
      <RadioOptionControlContent {...props} />
      {props.option.iconSource || props.checked ? (
        <View style={props.layout === 'vertical' ? styles.corner : undefined}>
          <RadioOptionControlIndicator
            checked={props.checked}
            accent={colors.accent}
            onAccent={colors.onAccent}
          />
        </View>
      ) : null}
    </View>
  );
}

interface RadioOptionControlProps<TValue extends string> extends Pick<
  RadioGroupProps<TValue>,
  'color' | 'size' | 'interactionPolicy'
> {
  option: RadioGroupProps<TValue>['options'][number];
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  layout: 'horizontal' | 'vertical';
  onSelect: () => void;
}

/*** Keep decoration passive while allowing labels to wrap at narrow widths and large text sizes. */
function RadioOptionControlContent<TValue extends string>({
  option,
  layout,
  size,
  color,
  invalid,
  disabled,
}: RadioOptionControlProps<TValue>) {
  const { theme } = useTheme();
  const colors = resolveRadioOptionColors(theme, { color, invalid, disabled });
  return (
    <>
      {option.iconSource ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Icon source={option.iconSource} size={size === 'l' ? 36 : 28} color={colors.accent} />
        </View>
      ) : null}
      <View style={layout === 'horizontal' ? styles.label : styles.centerLabel}>
        <Text
          variant={size === 'l' ? 'body' : 'bodySmall'}
          weight="semiBold"
          align={layout === 'vertical' || !option.iconSource ? 'center' : 'left'}
        >
          {option.label}
        </Text>
        {option.description ? (
          <Text
            emphasis="muted"
            variant="bodySmall"
            align={layout === 'vertical' || !option.iconSource ? 'center' : 'left'}
          >
            {option.description}
          </Text>
        ) : null}
      </View>
    </>
  );
}

/*** Draw a passive check using themed geometry without requiring an application media asset. */
function RadioOptionControlIndicator({
  checked,
  accent,
  onAccent,
}: {
  checked: boolean;
  accent: string;
  onAccent: string;
}) {
  const indicatorStyle = { backgroundColor: checked ? accent : 'transparent' };
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.indicator, indicatorStyle]}
    >
      {checked ? <View style={[styles.check, { borderColor: onAccent }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, flex: 1, minWidth: 0 },
  horizontal: { flexDirection: 'row', alignItems: 'center' },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  label: { flex: 1, minWidth: 0, gap: 4 },
  centerLabel: { alignSelf: 'stretch', gap: 4 },
  corner: { position: 'absolute', right: 8, top: 8 },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 7,
    height: 12,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: '45deg' }, { translateY: -2 }],
  },
});
