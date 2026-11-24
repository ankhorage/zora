import React from 'react';
import { Circle, Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { View } from '../layout/public';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { Text } from '../typography/public';
import { ColorHorizontalPointerProxy } from './ColorHorizontalPointerProxy';
import { resolveOklchColor } from './utils/resolveOklchColor';

const SPECTRUM_WIDTH = 280;
const SPECTRUM_HUES = [0, 60, 120, 180, 240, 300, 360] as const;

/*** Selects a controlled hue across the same full-spectrum track used by Studio tabs. */
export function ColorSpectrumSlider({
  disabled,
  hue,
  label = 'Hue',
  onChange,
}: {
  readonly disabled: boolean;
  readonly hue: number;
  readonly label?: string;
  readonly onChange: (hue: number) => void;
}) {
  const { theme } = useZoraTheme();
  const [trackWidth, setTrackWidth] = React.useState(SPECTRUM_WIDTH);
  const gradientId = `color-spectrum-${React.useId().replaceAll(':', '')}`;
  const changeAt = (locationX: number) => {
    if (!disabled) onChange(Math.max(0, Math.min(360, (locationX / trackWidth) * 360)));
  };

  return (
    <View gap="xxs" width="100%">
      <View direction="row" justify="space-between">
        <Text variant="label">{label}</Text>
        <Text variant="label">{`${Math.round(hue)}°`}</Text>
      </View>
      <ColorHorizontalPointerProxy disabled={disabled} onChange={changeAt} width={SPECTRUM_WIDTH}>
        <Svg
          accessibilityLabel={`${label} spectrum`}
          height={36}
          onLayout={(event) => setTrackWidth(Math.max(1, event.nativeEvent.layout.width))}
          viewBox={`0 0 ${SPECTRUM_WIDTH} 36`}
          width="100%"
        >
          <Defs>
            <LinearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              {SPECTRUM_HUES.map((stopHue, index) => (
                <Stop
                  key={stopHue}
                  offset={String(index / (SPECTRUM_HUES.length - 1))}
                  stopColor={resolveOklchColor({ lightness: 0.65, chroma: 0.2 }, stopHue)}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect fill={`url(#${gradientId})`} height={12} rx={6} width={SPECTRUM_WIDTH} y={12} />
          <Circle
            cx={(hue / 360) * SPECTRUM_WIDTH}
            cy={18}
            fill="white"
            r={10}
            stroke={theme.semantics.content.default}
            strokeWidth={2}
          />
          <Rect
            fill="transparent"
            height={36}
            onResponderGrant={(event) => changeAt(event.nativeEvent.locationX)}
            onResponderMove={(event) => changeAt(event.nativeEvent.locationX)}
            onResponderRelease={(event) => changeAt(event.nativeEvent.locationX)}
            onStartShouldSetResponder={() => !disabled}
            width={SPECTRUM_WIDTH}
          />
        </Svg>
      </ColorHorizontalPointerProxy>
    </View>
  );
}
