import { generateColorSwatch } from '@ankhorage/color-theory';
import { Pressable } from '@ankhorage/surface';

import type { ColorHueScaleProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../typography/public';

/*** Edits the 500 base color and previews its canonical 50-to-950 swatch. */
export const ColorHueScale = withZoraThemeScope(ColorHueScaleInner);

/*** Maps generated previews to an explicitly editable 500 base without misreporting preview selection. */
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
    <View bg="surfaceRaised" gap="sm" p="sm" radius="md" testID={testID}>
      <Text variant="label">Hue scale</Text>
      <View
        accessibilityLabel="Color scale previews; choose a preview as the next 500 base color"
        direction="row"
        gap="xs"
        wrap="wrap"
      >
        {swatches.map(([step, color]) => (
          <Pressable
            key={step}
            accessibilityLabel={
              Number(step) === 500
                ? `Current editable base color 500: ${color}`
                : `Use generated ${step} preview ${color} as the next base color 500`
            }
            bg={color}
            borderColor="border"
            borderWidth={Number(step) === 500 ? 3 : 1}
            disabled={interactionPolicy === 'passive'}
            height={48}
            onPress={() => onChange(color)}
            radius="sm"
            width="18%"
          >
            <Text align="center" variant="caption">
              {step}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
