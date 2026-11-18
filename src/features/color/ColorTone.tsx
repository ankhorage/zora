import { Button, Pressable } from '@ankhorage/surface';
import React from 'react';

import type { ColorToneProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { ColorWheel } from './ColorWheel';
import { resolveColorHue } from './utils/resolveColorHue';
import { resolveOklchColor } from './utils/resolveOklchColor';

/*** Selects consumer-provided OKLCH tone targets while keeping hue adjustable. */
export const ColorTone = withZoraThemeScope(ColorToneInner);

/*** Renders one supplied tone and its actual, editable OKLCH color selections. */
function ColorToneInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  interactionPolicy,
  tones,
  selectionMode = 'single',
  value,
  onChange,
  testID,
}: ColorToneProps) {
  const [editingColorIndex, setEditingColorIndex] = React.useState(0);
  const selectedTone = tones.find((tone) => tone.id === value?.toneId);
  const selectedColor = value?.colors.at(editingColorIndex) ?? value?.colors.at(0);
  const selectTone = (tone: ColorToneProps['tones'][number]) => {
    const hue = selectedColor ? resolveColorHue(selectedColor) : 0;
    setEditingColorIndex(0);
    onChange({ toneId: tone.id, colors: [resolveOklchColor(tone.accentTarget, hue)] });
  };

  return (
    <View gap="sm" testID={testID}>
      <View direction="row" wrap="wrap" gap="sm">
        {tones.map((tone) => {
          const selected = value?.toneId === tone.id;
          const color =
            selected && selectedColor ? selectedColor : resolveOklchColor(tone.accentTarget, 0);
          return (
            <Pressable
              key={tone.id}
              accessibilityLabel={tone.accent}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              bg={color}
              borderColor="border"
              borderWidth={selected ? 3 : 1}
              disabled={interactionPolicy === 'passive'}
              height={44}
              onPress={() => selectTone(tone)}
              radius="md"
              width={44}
            />
          );
        })}
      </View>
      {selectedTone && selectedColor && value ? (
        <>
          <View direction="row" gap="xs" wrap="wrap">
            {value.colors.map((color, index) => (
              <Pressable
                key={`${color}-${index}`}
                accessibilityLabel={`Selected ${selectedTone.accent} color ${index + 1}: ${color}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: editingColorIndex === index }}
                bg={color}
                borderColor="border"
                borderWidth={editingColorIndex === index ? 3 : 1}
                disabled={interactionPolicy === 'passive'}
                height={44}
                onPress={() => setEditingColorIndex(index)}
                radius="md"
                width={44}
              />
            ))}
            {selectionMode === 'multiple' ? (
              <Button
                disabled={interactionPolicy === 'passive'}
                onPress={() => {
                  setEditingColorIndex(value.colors.length);
                  onChange({
                    toneId: selectedTone.id,
                    colors: [...value.colors, resolveOklchColor(selectedTone.accentTarget, 0)],
                  });
                }}
              >
                Add color
              </Button>
            ) : null}
          </View>
          <ColorWheel
            harmony={null}
            interactionPolicy={interactionPolicy}
            onChange={({ color }) => {
              const nextColor = resolveOklchColor(
                selectedTone.accentTarget,
                resolveColorHue(color),
              );
              onChange({
                toneId: selectedTone.id,
                colors: value.colors.map((entry, index) =>
                  index === editingColorIndex ? nextColor : entry,
                ),
              });
            }}
            value={selectedColor}
          />
        </>
      ) : null}
    </View>
  );
}
