import { generateHarmonyRoleColors, type HexColor, isHexColor } from '@ankhorage/color-theory';
import { Button, TextInput } from '@ankhorage/surface';
import React from 'react';
import {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Svg,
} from 'react-native-svg';

import type { ColorWheelProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { ColorWheelKeyboardProxy } from './ColorWheelKeyboardProxy';
import { resolveColorHue } from './utils/resolveColorHue';
import { resolveOklchColor } from './utils/resolveOklchColor';
import { resolveWheelColor } from './utils/resolveWheelColor';
import { resolveWheelColorComponents } from './utils/resolveWheelColorComponents';

const WHEEL_SIZE = 240;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 104;
const WHEEL_SEGMENT_COUNT = 36;
const WHEEL_MAX_CHROMA = 0.2;

/*** Selects an OKLCH hue and optionally visualizes the existing color-theory harmony. */
export const ColorWheel = withZoraThemeScope(ColorWheelInner);

/*** Renders a directly manipulable hue wheel and harmony controls without returning derived colors. */
function ColorWheelInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  interactionPolicy,
  value,
  harmony = null,
  harmonies,
  onChange,
  testID,
}: ColorWheelProps) {
  const hue = resolveColorHue(value);
  const { chroma, lightness } = resolveWheelColorComponents(value);
  const harmonyColors = harmony ? generateHarmonyRoleColors(value, harmony).colors : [];
  const selectedPoint = resolveWheelPoint(hue, Math.min(1, chroma / WHEEL_MAX_CHROMA));
  const harmonyPoints = harmonyColors.map((color) => resolveWheelPoint(color.hueDegrees));
  const harmonyLines = resolveHarmonyLines(harmonyPoints, selectedPoint);
  const changeColorAt = (x: number, y: number) => {
    if (interactionPolicy === 'passive') return;
    onChange({
      color: resolveWheelColor(value, x, y, WHEEL_CENTER, WHEEL_RADIUS, WHEEL_MAX_CHROMA),
      harmony,
    });
  };
  const changeLightness = (nextLightness: number) =>
    onChange({
      color: resolveOklchColor({ chroma, lightness: Math.max(0, Math.min(1, nextLightness)) }, hue),
      harmony,
    });

  return (
    <View align="center" gap="sm" testID={testID}>
      <ColorWheelKeyboardProxy
        chroma={chroma}
        disabled={interactionPolicy === 'passive'}
        hue={hue}
        onChange={(nextHue, nextChroma) =>
          onChange({
            color: resolveOklchColor(
              { lightness: resolveWheelLightness(value), chroma: nextChroma },
              nextHue,
            ),
            harmony,
          })
        }
      >
        <Svg
          accessibilityLabel="Color wheel"
          height={WHEEL_SIZE}
          onResponderGrant={(event) => {
            const { locationX, locationY } = event.nativeEvent;
            changeColorAt(locationX, locationY);
          }}
          onResponderMove={(event) => {
            const { locationX, locationY } = event.nativeEvent;
            changeColorAt(locationX, locationY);
          }}
          onResponderRelease={(event) => {
            const { locationX, locationY } = event.nativeEvent;
            changeColorAt(locationX, locationY);
          }}
          onStartShouldSetResponder={() => interactionPolicy !== 'passive'}
          width={WHEEL_SIZE}
        >
          {resolveWheelSegments().map((segment) => (
            <Path d={segment.path} fill={segment.color} key={segment.hue} />
          ))}
          {harmony === 'triadic' && harmonyPoints.length === 3 ? (
            <Polygon
              fill="none"
              points={harmonyPoints.map((point) => `${point.x},${point.y}`).join(' ')}
              stroke="currentColor"
              strokeWidth={2}
            />
          ) : (
            harmonyLines
          )}
          {harmonyPoints.map((point) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill="currentColor"
              key={`${point.x}-${point.y}`}
              r={5}
            />
          ))}
          <Circle
            cx={selectedPoint.x}
            cy={selectedPoint.y}
            fill="none"
            r={9}
            stroke="currentColor"
            strokeWidth={3}
          />
        </Svg>
      </ColorWheelKeyboardProxy>
      <ColorLightnessSlider
        chroma={chroma}
        disabled={interactionPolicy === 'passive'}
        hue={hue}
        lightness={lightness}
        onChange={changeLightness}
      />
      <ColorHexInput
        disabled={interactionPolicy === 'passive'}
        harmony={harmony}
        key={value}
        onChange={onChange}
        value={value}
      />
      {harmonies ? (
        <View direction="row" gap="xs" wrap="wrap">
          <Button
            disabled={interactionPolicy === 'passive'}
            onPress={() => onChange({ color: value, harmony: null })}
            variant={harmony === null ? 'solid' : 'outline'}
          >
            None
          </Button>
          {harmonies.map((candidate) => (
            <Button
              key={candidate}
              disabled={interactionPolicy === 'passive'}
              onPress={() => onChange({ color: value, harmony: candidate })}
              variant={harmony === candidate ? 'solid' : 'outline'}
            >
              {candidate}
            </Button>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/*** Renders a continuous OKLCH lightness track without adding a second color persistence model. */
function ColorLightnessSlider({
  chroma,
  disabled,
  hue,
  lightness,
  onChange,
}: {
  readonly chroma: number;
  readonly disabled: boolean;
  readonly hue: number;
  readonly lightness: number;
  readonly onChange: (lightness: number) => void;
}) {
  const changeAt = (locationX: number) => {
    if (!disabled) onChange(Math.max(0, Math.min(1, locationX / WHEEL_SIZE)));
  };
  return (
    <Svg accessibilityLabel="Color lightness" height={36} width={WHEEL_SIZE}>
      <Defs>
        <LinearGradient id="color-lightness" x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor={resolveOklchColor({ chroma, lightness: 0 }, hue)} />
          <Stop offset="1" stopColor={resolveOklchColor({ chroma, lightness: 1 }, hue)} />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#color-lightness)" height={10} rx={5} y={13} width={WHEEL_SIZE} />
      <Circle
        cx={lightness * WHEEL_SIZE}
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
        width={WHEEL_SIZE}
      />
    </Svg>
  );
}

/*** Build the wheel's OKLCH segments from the existing conversion tool. */
function resolveWheelSegments(): readonly {
  readonly color: HexColor;
  readonly hue: number;
  readonly path: string;
}[] {
  return Array.from({ length: WHEEL_SEGMENT_COUNT }, (_, index) => {
    const hue = (index * 360) / WHEEL_SEGMENT_COUNT;
    return {
      color: resolveOklchColor({ lightness: 0.65, chroma: WHEEL_MAX_CHROMA }, hue),
      hue,
      path: resolveSegmentPath(hue, hue + 360 / WHEEL_SEGMENT_COUNT),
    };
  });
}

/*** Describe one wedge in the visual hue wheel. */
function resolveSegmentPath(startHue: number, endHue: number): string {
  const start = resolveWheelPoint(startHue);
  const end = resolveWheelPoint(endHue);
  return `M ${WHEEL_CENTER} ${WHEEL_CENTER} L ${start.x} ${start.y} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${end.x} ${end.y} Z`;
}

/*** Convert a hue degree to the corresponding visual wheel coordinate. */
function resolveWheelPoint(
  hue: number,
  radiusRatio = 1,
): { readonly x: number; readonly y: number } {
  const radians = ((hue - 90) * Math.PI) / 180;
  return {
    x: WHEEL_CENTER + WHEEL_RADIUS * radiusRatio * Math.cos(radians),
    y: WHEEL_CENTER + WHEEL_RADIUS * radiusRatio * Math.sin(radians),
  };
}

/*** Connect consecutive harmony points without dynamic collection indexing. */
function resolveHarmonyLines(
  points: readonly { readonly x: number; readonly y: number }[],
  selectedPoint: { readonly x: number; readonly y: number },
) {
  return points.slice(1).reduce(
    ({ lines, previous }, point) => ({
      lines: [
        ...lines,
        <Line
          key={`${previous.x}-${previous.y}-${point.x}-${point.y}`}
          stroke="currentColor"
          strokeWidth={2}
          x1={previous.x}
          x2={point.x}
          y1={previous.y}
          y2={point.y}
        />,
      ],
      previous: point,
    }),
    { lines: [] as React.ReactNode[], previous: points.at(0) ?? selectedPoint },
  ).lines;
}

/*** Read the selected color's lightness for wheel-only hue and chroma changes. */
function resolveWheelLightness(color: HexColor): number {
  const { lightness } = resolveWheelColorComponents(color);
  return lightness;
}

/*** Retains in-progress hexadecimal input while resetting for an externally controlled color. */
function ColorHexInput({
  disabled,
  harmony,
  onChange,
  value,
}: Pick<ColorWheelProps, 'harmony' | 'onChange' | 'value'> & { readonly disabled: boolean }) {
  const [input, setInput] = React.useState<string>(value);
  return (
    <TextInput
      accessibilityLabel="Color hex value"
      disabled={disabled}
      onChangeText={(nextValue) => {
        setInput(nextValue);
        if (isHexColor(nextValue)) onChange({ color: nextValue, harmony: harmony ?? null });
      }}
      value={input}
    />
  );
}
