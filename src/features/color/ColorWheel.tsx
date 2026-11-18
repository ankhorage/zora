import { Button } from '@ankhorage/surface';
import {
  COLOR_HARMONIES,
  generateHarmonyRoleColors,
  type ColorHarmony,
  type HexColor,
} from '@ankhorage/color-theory';
import React from 'react';
import { Circle, Line, Path, Polygon, Svg } from 'react-native-svg';

import type { ColorWheelProps } from '../../types/color';
import { View } from '../layout/public';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { resolveColorAtHue, resolveColorHue, resolveOklchColor } from './colorMath';

const WHEEL_SIZE = 240;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 104;
const WHEEL_SEGMENT_COUNT = 36;

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
  const harmonyColors = harmony ? generateHarmonyRoleColors(value, harmony).colors : [];
  const selectedPoint = resolveWheelPoint(hue);
  const harmonyPoints = harmonyColors.map((color) => resolveWheelPoint(color.hueDegrees));

  return (
    <View align="center" gap="sm" testID={testID}>
      <Svg
        accessibilityLabel="Color wheel"
        accessibilityRole="adjustable"
        height={WHEEL_SIZE}
        onPress={(event) => {
          if (interactionPolicy === 'disabled') return;
          const { locationX, locationY } = event.nativeEvent;
          onChange({ color: resolveColorAtHue(value, resolvePointerHue(locationX, locationY)), harmony });
        }}
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
          harmonyPoints.slice(1).map((point, index) => (
            <Line
              key={`${point.x}-${point.y}`}
              stroke="currentColor"
              strokeWidth={2}
              x1={harmonyPoints[index]?.x}
              x2={point.x}
              y1={harmonyPoints[index]?.y}
              y2={point.y}
            />
          ))
        )}
        {harmonyPoints.map((point) => (
          <Circle cx={point.x} cy={point.y} fill="currentColor" key={`${point.x}-${point.y}`} r={5} />
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
      {harmonies ? (
        <View direction="row" gap="xs" wrap="wrap">
          <Button
            disabled={interactionPolicy === 'disabled'}
            onPress={() => onChange({ color: value, harmony: null })}
            variant={harmony === null ? 'solid' : 'outline'}
          >
            None
          </Button>
          {harmonies.map((candidate) => (
            <Button
              key={candidate}
              disabled={interactionPolicy === 'disabled'}
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

/*** Build the wheel's OKLCH segments from the existing conversion tool. */
function resolveWheelSegments(): readonly { readonly color: HexColor; readonly hue: number; readonly path: string }[] {
  return Array.from({ length: WHEEL_SEGMENT_COUNT }, (_, index) => {
    const hue = (index * 360) / WHEEL_SEGMENT_COUNT;
    return {
      color: resolveOklchColor({ lightness: 0.65, chroma: 0.2 }, hue),
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
function resolveWheelPoint(hue: number): { readonly x: number; readonly y: number } {
  const radians = ((hue - 90) * Math.PI) / 180;
  return {
    x: WHEEL_CENTER + WHEEL_RADIUS * Math.cos(radians),
    y: WHEEL_CENTER + WHEEL_RADIUS * Math.sin(radians),
  };
}

/*** Convert a wheel tap position into a normalized hue degree. */
function resolvePointerHue(x: number, y: number): number {
  const degrees = (Math.atan2(y - WHEEL_CENTER, x - WHEEL_CENTER) * 180) / Math.PI + 90;
  return degrees < 0 ? degrees + 360 : degrees;
}
