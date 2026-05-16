import type {
  SurfaceColor,
  SurfaceEmphasis,
  SurfacePaletteColor,
  SurfaceStatusColor,
} from '@ankhorage/surface';

export type ZoraPaletteColor = SurfacePaletteColor;
export type ZoraStatusColor = SurfaceStatusColor;
export type ZoraColor = SurfaceColor;
export type ZoraEmphasis = SurfaceEmphasis;

export const ZORA_PALETTE_COLORS = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'neutral',
] as const satisfies readonly SurfacePaletteColor[];

export const ZORA_STATUS_COLORS = [
  'success',
  'warning',
  'error',
  'info',
] as const satisfies readonly SurfaceStatusColor[];

export const ZORA_COLORS = [
  ...ZORA_PALETTE_COLORS,
  ...ZORA_STATUS_COLORS,
  'danger',
] as const satisfies readonly SurfaceColor[];

export const ZORA_EMPHASES = [
  'default',
  'muted',
  'subtle',
  'inverse',
] as const satisfies readonly SurfaceEmphasis[];
