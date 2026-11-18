import { generateColorSwatch } from '@ankhorage/color-theory';
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
  const swatches = Object.entries(swatch);

  return (
    <View
      accessibilityLabel="Color shade selection"
      accessibilityRole="radiogroup"
      direction="row"
      gap="xs"
      testID={testID}
      wrap="wrap"
    >
      {swatches.map(([step, color]) => (
        <Pressable
          key={step}
          accessibilityLabel={`Color ${step}`}
          accessibilityRole="radio"
          accessibilityState={{ checked: Number(step) === 500 }}
          bg={color}
          borderColor="border"
          borderWidth={Number(step) === 500 ? 3 : 1}
          disabled={interactionPolicy === 'passive'}
          height={48}
          onPress={() => onChange(color)}
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
