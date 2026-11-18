import { Pressable } from '@ankhorage/surface';
import React from 'react';

import type { ColorToneProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { resolveOklchColor } from './colorMath';

/*** Selects consumer-provided OKLCH tone targets while keeping hue adjustable. */
export const ColorTone = withZoraThemeScope(ColorToneInner);

/*** Renders accessible single or multiple selection controls for the supplied tone catalog entries. */
function ColorToneInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  interactionPolicy,
  tones,
  hue,
  selectionMode = 'single',
  value,
  onChange,
  testID,
}: ColorToneProps) {
  return (
    <View direction="row" wrap="wrap" gap="sm" testID={testID}>
      {tones.map((tone) => {
        const selected = value.includes(tone.id);
        const color = resolveOklchColor(tone.accentTarget, hue);
        return (
          <Pressable
            key={tone.id}
            accessibilityLabel={tone.accent}
            accessibilityRole={selectionMode === 'single' ? 'radio' : 'checkbox'}
            accessibilityState={{ checked: selected }}
            bg={color}
            borderColor="border"
            borderWidth={selected ? 3 : 1}
            disabled={interactionPolicy === 'disabled'}
            height={44}
            onPress={() => onChange(resolveToneSelection(tone.id, value, selectionMode, tones, hue))}
            radius="md"
            width={44}
          />
        );
      })}
    </View>
  );
}

/*** Produce the compact tone result without exposing the component's visual catalog state. */
function resolveToneSelection(
  toneId: string,
  value: readonly string[],
  selectionMode: NonNullable<ColorToneProps['selectionMode']>,
  tones: readonly ColorToneProps['tones'][number][],
  hue: number,
) {
  const selectedIds =
    selectionMode === 'single'
      ? [toneId]
      : value.includes(toneId)
        ? value.filter((id) => id !== toneId)
        : [...value, toneId];
  const colors = selectedIds.flatMap((id) => {
    const tone = tones.find((entry) => entry.id === id);
    return tone ? [resolveOklchColor(tone.accentTarget, hue)] : [];
  });

  return { toneId, colors };
}
