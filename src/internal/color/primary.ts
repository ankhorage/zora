import type { ZoraHexColor, ZoraThemeMode } from '../../theme/types';
import { clampOklchToGamut, formatOklchAsHex, parseHexToOklch } from './oklch';
import type { ZoraOklchColor } from './types';

const FALLBACK_PRIMARY_COLOR: ZoraHexColor = '#0f766e';

const LIGHT_PRIMARY_LIGHTNESS_TARGET = 0.52;
const DARK_PRIMARY_LIGHTNESS_TARGET = 0.72;

const MIN_PRIMARY_CHROMA = 0.04;
const MAX_LIGHT_PRIMARY_CHROMA = 0.18;
const MAX_DARK_PRIMARY_CHROMA = 0.2;

const LIGHTNESS_BLEND = 0.85;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function resolveModePrimaryTargetLightness(mode: ZoraThemeMode): number {
  return mode === 'dark' ? DARK_PRIMARY_LIGHTNESS_TARGET : LIGHT_PRIMARY_LIGHTNESS_TARGET;
}

function resolveModePrimaryMaxChroma(mode: ZoraThemeMode): number {
  return mode === 'dark' ? MAX_DARK_PRIMARY_CHROMA : MAX_LIGHT_PRIMARY_CHROMA;
}

export function resolveModePrimaryColor(
  primaryColor: ZoraHexColor,
  mode: ZoraThemeMode,
): ZoraHexColor {
  let seed: ZoraOklchColor;

  try {
    seed = parseHexToOklch(primaryColor);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (process.env.NODE_ENV === 'production') {
      console.warn(`Invalid ZORA primaryColor '${primaryColor}'. Falling back. ${message}`);
      return FALLBACK_PRIMARY_COLOR;
    }

    throw error instanceof Error ? error : new Error(message);
  }

  const targetLightness = resolveModePrimaryTargetLightness(mode);
  const maxChroma = resolveModePrimaryMaxChroma(mode);

  const blendedLightness = seed.l + (targetLightness - seed.l) * LIGHTNESS_BLEND;
  const boundedLightness = clampNumber(blendedLightness, 0.12, 0.92);

  const cappedChroma = clampNumber(seed.c, 0, maxChroma);
  const boundedChroma =
    seed.c < MIN_PRIMARY_CHROMA ? cappedChroma : Math.max(cappedChroma, MIN_PRIMARY_CHROMA);

  const derived = clampOklchToGamut({
    l: boundedLightness,
    c: boundedChroma,
    h: seed.h,
  });

  return formatOklchAsHex(derived);
}
