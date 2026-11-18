import { converter, formatHex } from '@ankhorage/color-theory/culori';
import type { HexColor } from '@ankhorage/color-theory';
import { parseHexColorOrThrow } from '@ankhorage/color-theory';

import type { ColorToneTarget } from '../../types/color';

const toOklch = converter('oklch');

/*** Resolve a valid hex color from a bounded OKLCH target without owning color theory policy. */
export function resolveOklchColor(
  target: ColorToneTarget,
  hue: number,
): HexColor {
  const formatted = formatHex({ mode: 'oklch', l: target.lightness, c: target.chroma, h: hue });
  if (!formatted) throw new Error('The supplied OKLCH target cannot be represented as a hex color.');
  return parseHexColorOrThrow(formatted);
}

/*** Read the editable hue from a selected hex color. */
export function resolveColorHue(color: HexColor): number {
  const parsed = toOklch(color);
  return typeof parsed?.h === 'number' ? parsed.h : 0;
}

/*** Preserve the selected color's lightness and chroma while changing its hue. */
export function resolveColorAtHue(color: HexColor, hue: number): HexColor {
  const parsed = toOklch(color);
  if (!parsed || typeof parsed.l !== 'number' || typeof parsed.c !== 'number') return color;

  const formatted = formatHex({ mode: 'oklch', l: parsed.l, c: parsed.c, h: hue });
  return formatted ? parseHexColorOrThrow(formatted) : color;
}
