import { converter } from '@ankhorage/color-theory/culori';
import type { HexColor } from '@ankhorage/color-theory';

const toOklch = converter('oklch');

/*** Read the editable hue from a selected hex color. */
export function resolveColorHue(color: HexColor): number {
  const parsed = toOklch(color);
  return typeof parsed?.h === 'number' ? parsed.h : 0;
}
