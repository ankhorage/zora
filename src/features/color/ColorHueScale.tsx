import { generateColorSwatch } from '@ankhorage/color-theory';
import { Pressable } from '@ankhorage/surface';

import type { ColorHueScaleProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { Text } from '../typography/public';
import { ColorHexField } from './ColorHexField';
import { ColorSpectrumSlider } from './ColorSpectrumSlider';
import { resolveColorAtHue } from './utils/resolveColorAtHue';
import { resolveColorHue } from './utils/resolveColorHue';

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
  const { theme } = useZoraTheme();
  const { swatch } = generateColorSwatch(value);
  const swatches = Object.entries(swatch);

  return (
    <View gap="m" testID={testID}>
      <ColorSpectrumSlider
        disabled={interactionPolicy === 'passive'}
        hue={resolveColorHue(value)}
        onChange={(nextHue) => onChange(resolveColorAtHue(value, nextHue))}
      />
      <Text variant="label">Intensity</Text>
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
            borderColor={theme.semantics.border.default}
            borderWidth={Number(step) === 500 ? 3 : 1}
            disabled={interactionPolicy === 'passive'}
            height={48}
            onPress={() => onChange(color)}
            radius="s"
            width="18%"
          >
            <Text align="center" variant="caption">
              {step}
            </Text>
          </Pressable>
        ))}
      </View>
      <ColorHexField
        disabled={interactionPolicy === 'passive'}
        key={value}
        onChange={onChange}
        value={value}
      />
    </View>
  );
}
