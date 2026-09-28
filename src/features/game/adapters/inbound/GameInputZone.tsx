import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import type { GameInputZoneProps } from '../../../../types/gamePresentation';
import { toGamePercentage } from '../../utils/toGamePercentage';
import { useGameInputZoneResponder } from './useGameInputZoneResponder';

/*** Capture pointer/touch geometry and optional keyboard input as normalized generic Game events. */
export function GameInputZone({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  zIndex = 0,
  enabled = true,
  continuous = true,
  keyboardBindings,
  accessibilityLabel,
  interactionPolicy,
  testID,
  ...inputProps
}: GameInputZoneProps) {
  const { dispatchKeyboard, dispatchPointer, handleLayout, shouldSetResponder } =
    useGameInputZoneResponder({
      ...inputProps,
      x,
      y,
      width,
      height,
      enabled: enabled && interactionPolicy !== 'passive',
      interactionPolicy,
      continuous,
      ...(keyboardBindings === undefined ? {} : { keyboardBindings }),
    });
  const keyboardProps = createGameInputZoneKeyboardProps({
    dispatchKeyboard,
    enabled: enabled && interactionPolicy !== 'passive',
    keyboardBindings,
  });

  return (
    <View
      {...keyboardProps}
      {...(accessibilityLabel === undefined ? {} : { accessibilityLabel })}
      {...(testID === undefined ? {} : { testID })}
      {...(continuous
        ? { onResponderGrant: dispatchPointer, onResponderMove: dispatchPointer }
        : { onResponderRelease: dispatchPointer })}
      collapsable={false}
      onLayout={handleLayout}
      onStartShouldSetResponder={shouldSetResponder}
      pointerEvents={enabled && interactionPolicy !== 'passive' ? 'auto' : 'none'}
      style={createInputZoneStyle({ x, y, width, height, zIndex })}
    />
  );
}

interface GameInputZoneKeyboardPropsInput {
  readonly dispatchKeyboard: (event: { readonly key: string; preventDefault(): void }) => void;
  readonly enabled: boolean;
  readonly keyboardBindings: GameInputZoneProps['keyboardBindings'];
}

/*** Add a focusable web keyboard target only when the input zone owns key bindings. */
function createGameInputZoneKeyboardProps({
  dispatchKeyboard,
  enabled,
  keyboardBindings,
}: GameInputZoneKeyboardPropsInput) {
  if (Platform.OS !== 'web' || !enabled || keyboardBindings === undefined) return {};
  if (keyboardBindings.length === 0) return {};

  return { onKeyDown: dispatchKeyboard, tabIndex: 0 as const };
}

interface InputZoneStyleInput {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly zIndex: number;
}

/*** Convert field-relative input-zone props into one absolute React Native style. */
function createInputZoneStyle({ x, y, width, height, zIndex }: InputZoneStyleInput): ViewStyle {
  return {
    left: toGamePercentage(x),
    top: toGamePercentage(y),
    width: toGamePercentage(width),
    height: toGamePercentage(height),
    zIndex,
    ...styles.root,
  };
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
  },
});
