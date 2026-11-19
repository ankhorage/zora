import { View } from 'react-native';

import type { ColorWheelKeyboardProxyProps } from './ColorWheelKeyboardProxy';

/*** Exposes native accessibility increment and decrement actions for the controlled color wheel. */
export function ColorWheelKeyboardProxy({
  children,
  chroma,
  disabled,
  hue,
  onChange,
}: ColorWheelKeyboardProxyProps) {
  return (
    <View
      accessible
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      accessibilityLabel="Color wheel"
      accessibilityRole="adjustable"
      accessibilityState={{ disabled }}
      accessibilityValue={{
        max: 360,
        min: 0,
        now: Math.round(hue),
        text: `Hue ${Math.round(hue)}, chroma ${chroma.toFixed(2)}`,
      }}
      onAccessibilityAction={(event) => {
        if (disabled) return;
        onChange(event.nativeEvent.actionName === 'increment' ? hue + 5 : hue - 5, chroma);
      }}
    >
      {children}
    </View>
  );
}
