import { Button, Pressable } from '@ankhorage/surface';
import React from 'react';
import { Circle, Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import type { ColorToneProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { Text } from '../typography/public';
import { resolveColorHue } from './utils/resolveColorHue';
import { resolveOklchColor } from './utils/resolveOklchColor';

const MAX_TONE_COLORS = 4;

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
  const colors = value
    ? selectionMode === 'single'
      ? value.colors.slice(0, 1)
      : value.colors.slice(0, MAX_TONE_COLORS)
    : [];
  const currentEditingColorIndex = Math.min(editingColorIndex, Math.max(0, colors.length - 1));
  const selectedColor = colors.at(currentEditingColorIndex);
  const selectTone = (tone: ColorToneProps['tones'][number]) => {
    const hue = selectedColor ? resolveColorHue(selectedColor) : 0;
    setEditingColorIndex(0);
    onChange({ toneId: tone.id, colors: [resolveOklchColor(tone.accentTarget, hue)] });
  };

  return (
    <View bg="surfaceRaised" gap="sm" p="sm" radius="md" testID={testID}>
      <Text variant="label">Tone</Text>
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
            {colors.map((color, index) => (
              <Pressable
                key={`${color}-${index}`}
                accessibilityLabel={`Selected ${selectedTone.accent} color ${index + 1}: ${color}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: currentEditingColorIndex === index }}
                bg={color}
                borderColor="border"
                borderWidth={currentEditingColorIndex === index ? 3 : 1}
                disabled={interactionPolicy === 'passive'}
                height={44}
                onPress={() => setEditingColorIndex(index)}
                radius="md"
                width={44}
              />
            ))}
            {selectionMode === 'multiple' ? (
              <Button
                disabled={interactionPolicy === 'passive' || colors.length >= MAX_TONE_COLORS}
                onPress={() => {
                  setEditingColorIndex(colors.length);
                  onChange({
                    toneId: selectedTone.id,
                    colors: [...colors, resolveOklchColor(selectedTone.accentTarget, 0)],
                  });
                }}
              >
                Add color
              </Button>
            ) : null}
            {selectionMode === 'multiple' && colors.length > 1 ? (
              <Button
                disabled={interactionPolicy === 'passive'}
                onPress={() => {
                  const nextColors = colors.filter(
                    (_, index) => index !== currentEditingColorIndex,
                  );
                  setEditingColorIndex(Math.min(currentEditingColorIndex, nextColors.length - 1));
                  onChange({ toneId: selectedTone.id, colors: nextColors });
                }}
              >
                Remove color
              </Button>
            ) : null}
          </View>
          <ToneHueSlider
            disabled={interactionPolicy === 'passive'}
            hue={resolveColorHue(selectedColor)}
            onChange={(nextHue) =>
              onChange({
                toneId: selectedTone.id,
                colors: colors.map((entry, index) =>
                  index === currentEditingColorIndex
                    ? resolveOklchColor(selectedTone.accentTarget, nextHue)
                    : entry,
                ),
              })
            }
          />
        </>
      ) : null}
    </View>
  );
}

/*** Adjusts only the hue of the active catalog tone, preserving its supplied target semantics. */
function ToneHueSlider({
  disabled,
  hue,
  onChange,
}: {
  readonly disabled: boolean;
  readonly hue: number;
  readonly onChange: (hue: number) => void;
}) {
  const [trackWidth, setTrackWidth] = React.useState(240);
  const changeAt = (locationX: number) => {
    if (!disabled) onChange(Math.max(0, Math.min(360, (locationX / trackWidth) * 360)));
  };
  return (
    <View gap="xxs" width="100%">
      <View direction="row" justify="space-between">
        <Text variant="label">Hue</Text>
        <Text variant="label">{`${Math.round(hue)}°`}</Text>
      </View>
      <Svg
        accessibilityLabel="Tone hue"
        height={36}
        onLayout={(event) => setTrackWidth(Math.max(1, event.nativeEvent.layout.width))}
        width="100%"
        viewBox="0 0 240 36"
      >
        <Defs>
          <LinearGradient id="tone-hue" x1="0" x2="1" y1="0" y2="0">
            {HUE_STOPS.map(({ color, offset }) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect fill="url(#tone-hue)" height={12} rx={6} width={240} y={12} />
        <Circle
          cx={(hue / 360) * 240}
          cy={18}
          fill="white"
          r={10}
          stroke="currentColor"
          strokeWidth={2}
        />
        <Rect
          fill="transparent"
          height={36}
          onResponderGrant={(event) => changeAt(event.nativeEvent.locationX)}
          onResponderMove={(event) => changeAt(event.nativeEvent.locationX)}
          onResponderRelease={(event) => changeAt(event.nativeEvent.locationX)}
          onStartShouldSetResponder={() => !disabled}
          width={240}
        />
      </Svg>
    </View>
  );
}

const HUE_STOPS = [0, 60, 120, 180, 240, 300, 360].map((hue, index, hues) => ({
  color: resolveOklchColor({ lightness: 0.65, chroma: 0.2 }, hue),
  offset: String(index / (hues.length - 1)),
}));
