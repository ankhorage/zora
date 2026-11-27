import { generateHarmonyRoleColors, type HexColor } from '@ankhorage/color-theory';
import React from 'react';
import { Circle, Defs, Line, Path, Polygon, RadialGradient, Stop, Svg } from 'react-native-svg';

import type { ColorWheelProps } from '../../types/color';
import { withZoraThemeScope } from '../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../theme/composition/useZoraTheme';
import { ColorWheelKeyboardProxy } from './ColorWheelKeyboardProxy';
import { ColorWheelPointerProxy } from './ColorWheelPointerProxy';
import { resolveColorHue } from './utils/resolveColorHue';
import { resolveOklchColor } from './utils/resolveOklchColor';
import { resolveWheelColor } from './utils/resolveWheelColor';
import { resolveWheelColorComponents } from './utils/resolveWheelColorComponents';

const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const RADIUS = 480;
const SEGMENTS = 360;
const MAX_CHROMA = 0.2;

/*** Renders a size-owned, filled OKLCH wheel with controlled primary and harmony points. */
export const ColorWheel = withZoraThemeScope(ColorWheelInner);

/*** Maps pointer and keyboard input through one viewBox into the controlled selected colour. */
function ColorWheelInner({
  themeId: _themeId,
  mode: _mode,
  inverted: _inverted,
  interactionPolicy,
  value,
  harmony = null,
  toneTarget,
  onChange,
  size = 340,
  testID,
}: ColorWheelProps) {
  const { theme } = useZoraTheme();
  const hue = resolveColorHue(value);
  const { chroma, lightness } = resolveWheelColorComponents(value);
  const targetLightness = toneTarget?.lightness ?? lightness;
  const maximumChroma = toneTarget?.chroma ?? MAX_CHROMA;
  const primaryPoint = pointFor(hue, Math.min(1, chroma / maximumChroma));
  const harmonyRoles = harmony ? generateHarmonyRoleColors(value, harmony).colors : [];
  const harmonyPoints = harmonyRoles.map((role) => ({
    color: role.hex,
    ...pointFor(
      role.hueDegrees,
      Math.min(1, resolveWheelColorComponents(role.hex).chroma / maximumChroma),
    ),
  }));
  const gradientId = `color-wheel-${React.useId().replaceAll(':', '')}`;
  const changeAt = (x: number, y: number) => {
    if (interactionPolicy !== 'passive')
      onChange({
        color: resolveWheelColor(value, x, y, CENTER, RADIUS, maximumChroma, targetLightness),
        harmony,
      });
  };
  return (
    <ColorWheelKeyboardProxy
      chroma={chroma}
      disabled={interactionPolicy === 'passive'}
      hue={hue}
      maxChroma={maximumChroma}
      onChange={(nextHue, nextChroma) =>
        onChange({
          color: resolveOklchColor({ chroma: nextChroma, lightness: targetLightness }, nextHue),
          harmony,
        })
      }
    >
      <ColorWheelPointerProxy
        disabled={interactionPolicy === 'passive'}
        height={VIEWBOX}
        onChange={changeAt}
        width={VIEWBOX}
      >
        <Svg
          accessibilityLabel="Color wheel"
          height={size}
          onResponderGrant={(event) =>
            changeAt(
              (event.nativeEvent.locationX / size) * VIEWBOX,
              (event.nativeEvent.locationY / size) * VIEWBOX,
            )
          }
          onResponderMove={(event) =>
            changeAt(
              (event.nativeEvent.locationX / size) * VIEWBOX,
              (event.nativeEvent.locationY / size) * VIEWBOX,
            )
          }
          onResponderRelease={(event) =>
            changeAt(
              (event.nativeEvent.locationX / size) * VIEWBOX,
              (event.nativeEvent.locationY / size) * VIEWBOX,
            )
          }
          onStartShouldSetResponder={() => interactionPolicy !== 'passive'}
          testID={testID}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          width={size}
        >
          <Defs>
            {segments(targetLightness, maximumChroma).map((segment) => (
              <RadialGradient
                cx={CENTER}
                cy={CENTER}
                id={`${gradientId}-${segment.hue}`}
                key={segment.hue}
                r={RADIUS}
              >
                <Stop
                  offset="0"
                  stopColor={resolveOklchColor(
                    { chroma: 0, lightness: targetLightness },
                    segment.hue,
                  )}
                />
                <Stop offset="1" stopColor={segment.color} />
              </RadialGradient>
            ))}
          </Defs>
          {segments(targetLightness, maximumChroma).map((segment) => (
            <Path d={segment.path} fill={`url(#${gradientId}-${segment.hue})`} key={segment.hue} />
          ))}
          {harmonyPoints.length >= 3 ? (
            <Polygon
              fill="none"
              points={harmonyPoints.map((point) => `${point.x},${point.y}`).join(' ')}
              stroke={theme.semantics.content.default}
              strokeWidth={6}
            />
          ) : (
            linesFor(harmonyPoints, primaryPoint, theme.semantics.content.default)
          )}
          {harmonyPoints
            .filter((point) => point.color !== value)
            .map((point) => (
              <Circle
                cx={point.x}
                cy={point.y}
                fill={point.color}
                key={`${point.x}-${point.y}`}
                stroke={theme.semantics.content.default}
                strokeWidth={6}
                r={26}
              />
            ))}
          <Circle
            cx={primaryPoint.x}
            cy={primaryPoint.y}
            fill="none"
            r={36}
            stroke="white"
            strokeWidth={12}
          />
          <Circle
            cx={primaryPoint.x}
            cy={primaryPoint.y}
            fill="none"
            r={42}
            stroke={theme.semantics.content.default}
            strokeWidth={6}
          />
        </Svg>
      </ColorWheelPointerProxy>
    </ColorWheelKeyboardProxy>
  );
}

/*** Creates fine radial hue segments from the same OKLCH projection used for interaction. */
function segments(
  lightness: number,
  maximumChroma: number,
): readonly {
  readonly color: HexColor;
  readonly hue: number;
  readonly path: string;
}[] {
  return Array.from({ length: SEGMENTS }, (_, index) => {
    const hue = (index * 360) / SEGMENTS;
    return {
      color: resolveOklchColor({ chroma: maximumChroma, lightness }, hue),
      hue,
      path: segmentPath(hue, hue + 360 / SEGMENTS),
    };
  });
}

/*** Describes one filled wheel segment in the stable coordinate system. */
function segmentPath(start: number, end: number) {
  const startPoint = pointFor(start);
  const endPoint = pointFor(end);
  return `M ${CENTER} ${CENTER} L ${startPoint.x} ${startPoint.y} A ${RADIUS} ${RADIUS} 0 0 1 ${endPoint.x} ${endPoint.y} Z`;
}

/*** Projects an OKLCH hue and chroma ratio into the wheel coordinate system. */
function pointFor(hue: number, ratio = 1) {
  const radians = ((hue - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * ratio * Math.cos(radians),
    y: CENTER + RADIUS * ratio * Math.sin(radians),
  };
}

/*** Connects derived harmony points behind their corresponding knobs. */
function linesFor(
  points: readonly { readonly x: number; readonly y: number }[],
  primary: { readonly x: number; readonly y: number },
  stroke: string,
) {
  return points.slice(1).reduce(
    ({ lines, previous }, point) => ({
      lines: [
        ...lines,
        <Line
          key={`${previous.x}-${previous.y}-${point.x}-${point.y}`}
          stroke={stroke}
          strokeWidth={6}
          x1={previous.x}
          x2={point.x}
          y1={previous.y}
          y2={point.y}
        />,
      ],
      previous: point,
    }),
    { lines: [] as React.ReactNode[], previous: points.at(0) ?? primary },
  ).lines;
}
