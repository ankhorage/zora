import type { HexColor } from '@ankhorage/color-theory';
import { converter } from '@ankhorage/color-theory/culori/fn';

const toOklch = converter('oklch');

/*** Read the selected OKLCH values used by wheel keyboard and accessibility controls. */
export function resolveWheelColorComponents(color: HexColor): {
  readonly chroma: number;
  readonly lightness: number;
} {
  const parsed = toOklch(color);
  return {
    chroma: typeof parsed?.c === 'number' ? parsed.c : 0,
    lightness: typeof parsed?.l === 'number' ? parsed.l : 0.65,
  };
}
