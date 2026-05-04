import type { ZoraColorTone } from '../../theme/types';
import type { ZoraHueScaleRoleId } from './scales';

export interface ZoraColorToneLaneRecipe {
  backgroundTone: ZoraColorTone;
  foregroundTone: ZoraColorTone;
}

export interface ZoraColorToneRoleChromaFactors {
  primary: number;
  secondary: number;
  accent: number;
  highlight: number;
  surfaceTint: number;
}

export interface ZoraColorToneRecipe {
  colorTone: ZoraColorTone;
  laneRecipe: ZoraColorToneLaneRecipe;
  roleChromaFactors: ZoraColorToneRoleChromaFactors;
  maxChroma: number;
  minMidChroma: number;
}

const ZORA_COLOR_TONE_RECIPES = {
  neutral: {
    colorTone: 'neutral',
    laneRecipe: { backgroundTone: 'neutral', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 0.72,
      secondary: 0.48,
      accent: 0.56,
      highlight: 0.6,
      surfaceTint: 0.12,
    },
    maxChroma: 0.14,
    minMidChroma: 0.025,
  },
  pastel: {
    colorTone: 'pastel',
    laneRecipe: { backgroundTone: 'pastel', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 0.58,
      secondary: 0.48,
      accent: 0.55,
      highlight: 0.62,
      surfaceTint: 0.2,
    },
    maxChroma: 0.12,
    minMidChroma: 0.02,
  },
  earth: {
    colorTone: 'earth',
    laneRecipe: { backgroundTone: 'earth', foregroundTone: 'mineral' },
    roleChromaFactors: {
      primary: 0.64,
      secondary: 0.52,
      accent: 0.58,
      highlight: 0.6,
      surfaceTint: 0.16,
    },
    maxChroma: 0.13,
    minMidChroma: 0.022,
  },
  mineral: {
    colorTone: 'mineral',
    laneRecipe: { backgroundTone: 'mineral', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 0.7,
      secondary: 0.56,
      accent: 0.64,
      highlight: 0.68,
      surfaceTint: 0.16,
    },
    maxChroma: 0.14,
    minMidChroma: 0.025,
  },
  muted: {
    colorTone: 'muted',
    laneRecipe: { backgroundTone: 'muted', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 0.6,
      secondary: 0.5,
      accent: 0.56,
      highlight: 0.6,
      surfaceTint: 0.14,
    },
    maxChroma: 0.12,
    minMidChroma: 0.02,
  },
  jewel: {
    colorTone: 'jewel',
    laneRecipe: { backgroundTone: 'neutral', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 1,
      secondary: 0.72,
      accent: 0.85,
      highlight: 1,
      surfaceTint: 0.18,
    },
    maxChroma: 0.2,
    minMidChroma: 0.04,
  },
  fluorescent: {
    colorTone: 'fluorescent',
    laneRecipe: { backgroundTone: 'obsidian', foregroundTone: 'fluorescent' },
    roleChromaFactors: {
      primary: 1.12,
      secondary: 0.82,
      accent: 1.05,
      highlight: 1.18,
      surfaceTint: 0.22,
    },
    maxChroma: 0.24,
    minMidChroma: 0.045,
  },
  obsidian: {
    colorTone: 'obsidian',
    laneRecipe: { backgroundTone: 'obsidian', foregroundTone: 'fluorescent' },
    roleChromaFactors: {
      primary: 1.08,
      secondary: 0.78,
      accent: 1,
      highlight: 1.12,
      surfaceTint: 0.2,
    },
    maxChroma: 0.22,
    minMidChroma: 0.04,
  },
  vaporwave: {
    colorTone: 'vaporwave',
    laneRecipe: { backgroundTone: 'pastel', foregroundTone: 'fluorescent' },
    roleChromaFactors: {
      primary: 0.95,
      secondary: 0.72,
      accent: 1,
      highlight: 1.08,
      surfaceTint: 0.24,
    },
    maxChroma: 0.2,
    minMidChroma: 0.035,
  },
  monochromeAccent: {
    colorTone: 'monochromeAccent',
    laneRecipe: { backgroundTone: 'neutral', foregroundTone: 'jewel' },
    roleChromaFactors: {
      primary: 0.88,
      secondary: 0.36,
      accent: 0.95,
      highlight: 0.88,
      surfaceTint: 0.08,
    },
    maxChroma: 0.18,
    minMidChroma: 0.035,
  },
} satisfies Record<ZoraColorTone, ZoraColorToneRecipe>;

export function getZoraColorToneRecipe(colorTone: ZoraColorTone): ZoraColorToneRecipe {
  return ZORA_COLOR_TONE_RECIPES[colorTone];
}

export function getZoraColorToneRoleChromaFactor(
  recipe: ZoraColorToneRecipe,
  role: ZoraHueScaleRoleId,
): number {
  return recipe.roleChromaFactors[role];
}
