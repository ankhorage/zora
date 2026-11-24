import { type HexColor } from '@ankhorage/color-theory';
import { Button, Pressable } from '@ankhorage/surface';
import React from 'react';
import { Circle, Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import type { ColorToneProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { Text } from '../typography/public';
import { ColorHexField } from './ColorHexField';
import { ColorSpectrumSlider } from './ColorSpectrumSlider';
import { ColorWheelPointerProxy } from './ColorWheelPointerProxy';
import { resolveColorHue } from './utils/resolveColorHue';
import { resolveOklchColor } from './utils/resolveOklchColor';
import { resolveWheelColorComponents } from './utils/resolveWheelColorComponents';

const MAX_TONE_COLORS = 4;
const TONE_MAP_WIDTH = 280;
const TONE_MAP_HEIGHT = 220;
const TONE_MAX_CHROMA = 0.2;

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
  const { theme } = useZoraTheme();
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
    <View gap="m" testID={testID}>
      <View gap="xs">
        <Text variant="label">Tone</Text>
        <Text emphasis="muted" variant="caption">
          Choose a catalog tone
        </Text>
      </View>
      <View direction="row" gap="s" wrap="wrap">
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
              borderColor={theme.semantics.border.default}
              borderWidth={selected ? 3 : 1}
              disabled={interactionPolicy === 'passive'}
              height={56}
              onPress={() => selectTone(tone)}
              radius="m"
              width={56}
            >
              <Text align="center" variant="caption">
                {tone.accent}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {selectedTone && selectedColor && value ? (
        <>
          <ColorToneMap
            color={selectedColor}
            disabled={interactionPolicy === 'passive'}
            onChange={(lightness, chroma) =>
              onChange({
                toneId: selectedTone.id,
                colors: colors.map((entry, index) =>
                  index === currentEditingColorIndex
                    ? resolveOklchColor({ chroma, lightness }, resolveColorHue(entry))
                    : entry,
                ),
              })
            }
          />
          <View direction="row" gap="xs" wrap="wrap">
            {colors.map((color, index) => (
              <Pressable
                key={`${color}-${index}`}
                accessibilityLabel={`Selected ${selectedTone.accent} color ${index + 1}: ${color}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: currentEditingColorIndex === index }}
                bg={color}
                borderColor={theme.semantics.border.default}
                borderWidth={currentEditingColorIndex === index ? 3 : 1}
                disabled={interactionPolicy === 'passive'}
                height={44}
                onPress={() => setEditingColorIndex(index)}
                radius="m"
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
          <ColorSpectrumSlider
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
          <ColorHexField
            disabled={interactionPolicy === 'passive'}
            key={selectedColor}
            onChange={(color) =>
              onChange({
                toneId: selectedTone.id,
                colors: colors.map((entry, index) =>
                  index === currentEditingColorIndex ? color : entry,
                ),
              })
            }
            value={selectedColor}
          />
        </>
      ) : null}
    </View>
  );
}

/*** Renders the Studio-style saturation and lightness plane for the active catalog color. */
function ColorToneMap({
  color,
  disabled,
  onChange,
}: {
  readonly color: HexColor;
  readonly disabled: boolean;
  readonly onChange: (lightness: number, chroma: number) => void;
}) {
  const hue = resolveColorHue(color);
  const { chroma, lightness } = resolveWheelColorComponents(color);
  const gradientId = `color-tone-${React.useId().replaceAll(':', '')}`;
  const changeAt = (x: number, y: number) => {
    if (disabled) return;
    onChange(
      Math.max(0, Math.min(1, 1 - y / TONE_MAP_HEIGHT)),
      Math.max(0, Math.min(TONE_MAX_CHROMA, (x / TONE_MAP_WIDTH) * TONE_MAX_CHROMA)),
    );
  };

  return (
    <ColorWheelPointerProxy
      disabled={disabled}
      height={TONE_MAP_HEIGHT}
      onChange={changeAt}
      width={TONE_MAP_WIDTH}
    >
      <Svg accessibilityLabel="Tone color plane" height={TONE_MAP_HEIGHT} width={TONE_MAP_WIDTH}>
        <Defs>
          <LinearGradient id={`${gradientId}-white`} x1="0" x2="1" y1="0" y2="0">
            <Stop offset="0" stopColor="white" />
            <Stop
              offset="1"
              stopColor={resolveOklchColor({ chroma: TONE_MAX_CHROMA, lightness: 0.65 }, hue)}
            />
          </LinearGradient>
          <LinearGradient id={`${gradientId}-black`} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor="transparent" />
            <Stop offset="1" stopColor="black" />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${gradientId}-white)`} height={TONE_MAP_HEIGHT} width={TONE_MAP_WIDTH} />
        <Rect fill={`url(#${gradientId}-black)`} height={TONE_MAP_HEIGHT} width={TONE_MAP_WIDTH} />
        <Circle
          cx={(chroma / TONE_MAX_CHROMA) * TONE_MAP_WIDTH}
          cy={(1 - lightness) * TONE_MAP_HEIGHT}
          fill="none"
          r={10}
          stroke="white"
          strokeWidth={3}
        />
        <Rect
          fill="transparent"
          height={TONE_MAP_HEIGHT}
          onResponderGrant={(event) =>
            changeAt(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onResponderMove={(event) =>
            changeAt(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onResponderRelease={(event) =>
            changeAt(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onStartShouldSetResponder={() => !disabled}
          width={TONE_MAP_WIDTH}
        />
      </Svg>
    </ColorWheelPointerProxy>
  );
}
