import type { HexColor } from '@ankhorage/color-theory';
import { parseHexColorOrThrow } from '@ankhorage/color-theory';
import { formatHex } from '@ankhorage/color-theory/culori/fn';

import type { ColorToneTarget } from '../../../types/color';

/*** Resolve a valid hex color from a bounded OKLCH target without owning color theory policy. */
export function resolveOklchColor(target: ColorToneTarget, hue: number): HexColor {
  const formatted = formatHex({ mode: 'oklch', l: target.lightness, c: target.chroma, h: hue });
  if (!formatted)
    throw new Error('The supplied OKLCH target cannot be represented as a hex color.');
  return parseHexColorOrThrow(formatted);
}
