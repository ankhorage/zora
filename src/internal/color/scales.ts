import type { ZoraHexColor } from '../../theme/types';
import type { ZoraColorToneRecipe } from './colorToneRecipes';
import { getZoraColorToneRoleChromaFactor } from './colorToneRecipes';
import { clampOklchToGamut, formatOklchAsHex, parseHexToOklch } from './oklch';
import { type ZoraColorScale, type ZoraColorScaleStep } from './types';

export interface CreateZoraColorScaleOptions {
  seed: ZoraHexColor;
  role?: 'primary' | 'neutral';
}

export type ZoraHueScaleRoleId = 'primary' | 'secondary' | 'accent' | 'highlight' | 'surfaceTint';

export interface CreateZoraHueScaleOptions {
  hue: number;
  seedChroma: number;
  role: ZoraHueScaleRoleId;
  colorToneRecipe: ZoraColorToneRecipe;
}

const PRIMARY_LIGHTNESS_BY_STEP: Record<ZoraColorScaleStep, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.78,
  400: 0.68,
  500: 0.58,
  600: 0.5,
  700: 0.42,
  800: 0.34,
  900: 0.27,
  950: 0.2,
};

const NEUTRAL_LIGHTNESS_BY_STEP: Record<ZoraColorScaleStep, number> = {
  50: 0.98,
  100: 0.95,
  200: 0.89,
  300: 0.8,
  400: 0.68,
  500: 0.55,
  600: 0.44,
  700: 0.34,
  800: 0.25,
  900: 0.18,
  950: 0.12,
};

const PRIMARY_CHROMA_MULTIPLIER_BY_STEP: Record<ZoraColorScaleStep, number> = {
  50: 0.2,
  100: 0.3,
  200: 0.45,
  300: 0.7,
  400: 0.95,
  500: 1,
  600: 0.95,
  700: 0.85,
  800: 0.65,
  900: 0.45,
  950: 0.3,
};

const MAX_PRIMARY_SCALE_CHROMA = 0.2;
const MIN_PRIMARY_SCALE_CHROMA = 0.04;
const NEUTRAL_CHROMA = 0.012;
const DEFAULT_NEUTRAL_HUE_DEGREES = 260;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function resolvePrimaryScaleChroma(seedChroma: number, step: ZoraColorScaleStep): number {
  const cappedSeedChroma = clampNumber(seedChroma, 0, MAX_PRIMARY_SCALE_CHROMA);
  const multiplier = PRIMARY_CHROMA_MULTIPLIER_BY_STEP[step];
  const scaled = cappedSeedChroma * multiplier;

  const bounded = clampNumber(scaled, 0, MAX_PRIMARY_SCALE_CHROMA);
  const shouldEnforceMin = step >= 300 && step <= 700 && seedChroma >= MIN_PRIMARY_SCALE_CHROMA;

  return shouldEnforceMin ? Math.max(bounded, MIN_PRIMARY_SCALE_CHROMA) : bounded;
}

function resolveRoleScaleChroma(options: {
  seedChroma: number;
  step: ZoraColorScaleStep;
  maxChroma: number;
  minMidChroma: number;
}): number {
  const cappedSeedChroma = clampNumber(options.seedChroma, 0, options.maxChroma);
  const multiplier = PRIMARY_CHROMA_MULTIPLIER_BY_STEP[options.step];
  const scaled = cappedSeedChroma * multiplier;
  const bounded = clampNumber(scaled, 0, options.maxChroma);
  const shouldEnforceMin =
    options.step >= 300 && options.step <= 700 && options.seedChroma >= options.minMidChroma;

  return shouldEnforceMin ? Math.max(bounded, options.minMidChroma) : bounded;
}

function resolveHueScaleChroma(
  options: CreateZoraHueScaleOptions,
  step: ZoraColorScaleStep,
): number {
  const factor = getZoraColorToneRoleChromaFactor(options.colorToneRecipe, options.role);

  return resolveRoleScaleChroma({
    seedChroma: options.seedChroma * factor,
    step,
    maxChroma: options.colorToneRecipe.maxChroma,
    minMidChroma: options.colorToneRecipe.minMidChroma,
  });
}

function createScaleEntries(options: CreateZoraColorScaleOptions): ZoraColorScale {
  const seed = parseHexToOklch(options.seed);

  if (options.role === 'neutral') {
    const hue = typeof seed.h === 'number' ? seed.h : DEFAULT_NEUTRAL_HUE_DEGREES;

    return createScaleFromRamp({
      hue,
      chroma: NEUTRAL_CHROMA,
      lightnessByStep: NEUTRAL_LIGHTNESS_BY_STEP,
    });
  }

  return createScaleFromRamp({
    hue: seed.h,
    chromaByStep: (step) => resolvePrimaryScaleChroma(seed.c, step),
    lightnessByStep: PRIMARY_LIGHTNESS_BY_STEP,
  });
}

interface CreateScaleFromRampOptions {
  hue: number;
  chroma?: number;
  chromaByStep?: (step: ZoraColorScaleStep) => number;
  lightnessByStep: Record<ZoraColorScaleStep, number>;
}

function createScaleColor(
  options: CreateScaleFromRampOptions,
  step: ZoraColorScaleStep,
): ZoraHexColor {
  const lightness = options.lightnessByStep[step];
  const chroma =
    typeof options.chromaByStep === 'function' ? options.chromaByStep(step) : (options.chroma ?? 0);

  const clamped = clampOklchToGamut({
    l: clampNumber(lightness, 0, 1),
    c: clampNumber(chroma, 0, 1),
    h: options.hue,
  });

  return formatOklchAsHex(clamped);
}

function createScaleFromRamp(options: CreateScaleFromRampOptions): ZoraColorScale {
  return {
    50: createScaleColor(options, 50),
    100: createScaleColor(options, 100),
    200: createScaleColor(options, 200),
    300: createScaleColor(options, 300),
    400: createScaleColor(options, 400),
    500: createScaleColor(options, 500),
    600: createScaleColor(options, 600),
    700: createScaleColor(options, 700),
    800: createScaleColor(options, 800),
    900: createScaleColor(options, 900),
    950: createScaleColor(options, 950),
  };
}

export function createZoraColorScale(options: CreateZoraColorScaleOptions): ZoraColorScale {
  return createScaleEntries({
    seed: options.seed,
    role: options.role,
  });
}

export function createZoraPrimaryScale(seed: ZoraHexColor): ZoraColorScale {
  return createZoraColorScale({ seed, role: 'primary' });
}

export function createZoraNeutralScale(seed: ZoraHexColor = '#94a3b8'): ZoraColorScale {
  return createZoraColorScale({ seed, role: 'neutral' });
}

export function createZoraHueScale(options: CreateZoraHueScaleOptions): ZoraColorScale {
  return createScaleFromRamp({
    hue: options.hue,
    chromaByStep: (step) => resolveHueScaleChroma(options, step),
    lightnessByStep: PRIMARY_LIGHTNESS_BY_STEP,
  });
}
