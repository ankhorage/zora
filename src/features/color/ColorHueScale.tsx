import { COLOR_SWATCH_STEPS, generateColorSwatch } from '@ankhorage/color-theory';
import { Pressable } from '@ankhorage/surface';

import type { ColorHueScaleProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../typography/public';

/*** Selects a base color from the canonical color-theory 50-to-950 swatch. */
export const ColorHueScale = withZoraThemeScope(ColorHueScaleInner);

/*** Maps the generated ramp to accessible swatch controls and returns only the chosen base color. */
function ColorHueScaleInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  interactionPolicy,
  value,
  onChange,
  testID,
}: ColorHueScaleProps) {
  const { swatch } = generateColorSwatch(value);

  return (
    <View direction="row" gap="xs" testID={testID} wrap="wrap">
      {COLOR_SWATCH_STEPS.map((step) => (
        <Pressable
          key={step}
          accessibilityLabel={`Color ${step}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: step === 500 }}
          bg={swatch[step]}
          borderColor="border"
          borderWidth={step === 500 ? 3 : 1}
          disabled={interactionPolicy === 'passive'}
          height={48}
          onPress={() => onChange(step === 500 ? value : swatch[step])}
          radius="sm"
          width={48}
        >
          <Text align="center" variant="caption">
            {step}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
