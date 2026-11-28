import type { HexColor } from '@ankhorage/color-theory';

import { resolveOklchColor } from './resolveOklchColor';
import { resolveWheelColorComponents } from './resolveWheelColorComponents';

/*** Resolve a wheel coordinate into the same bounded OKLCH projection rendered by the wheel. */
export function resolveWheelColor(
  color: HexColor,
  x: number,
  y: number,
  center: number,
  radius: number,
  maxChroma: number,
  lightness = resolveWheelColorComponents(color).lightness,
): HexColor {
  const deltaX = x - center;
  const deltaY = y - center;
  const distance = Math.min(Math.hypot(deltaX, deltaY), radius);
  const hue = normalizeHue((Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90);
  const chroma = (distance / radius) * maxChroma;
  return resolveOklchColor({ lightness, chroma }, hue);
}

/*** Normalize an angular wheel coordinate to the OKLCH hue range. */
function normalizeHue(hue: number): number {
  return hue < 0 ? hue + 360 : hue;
}
