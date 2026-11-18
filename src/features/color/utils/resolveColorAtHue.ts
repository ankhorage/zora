import type { HexColor } from '@ankhorage/color-theory';
import { parseHexColorOrThrow } from '@ankhorage/color-theory';
import { converter, formatHex } from '@ankhorage/color-theory/culori/fn';

const toOklch = converter('oklch');

/*** Preserve the selected color's lightness and chroma while changing its hue. */
export function resolveColorAtHue(color: HexColor, hue: number): HexColor {
  const parsed = toOklch(color);
  if (!parsed || typeof parsed.l !== 'number' || typeof parsed.c !== 'number') return color;

  const formatted = formatHex({ mode: 'oklch', l: parsed.l, c: parsed.c, h: hue });
  return formatted ? parseHexColorOrThrow(formatted) : color;
}
