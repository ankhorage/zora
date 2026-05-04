import type { ZoraHexColor } from '../../theme/types';

export interface ZoraOklchColor {
  l: number;
  c: number;
  h: number;
}

export const ZORA_COLOR_SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type ZoraColorScaleStep = (typeof ZORA_COLOR_SCALE_STEPS)[number];

export type ZoraColorScale = Record<ZoraColorScaleStep, ZoraHexColor>;
