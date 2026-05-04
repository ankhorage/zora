import type { ColorHarmony, ColorTone, ThemeConfig } from '@ankhorage/surface';

export type ZoraThemeId = string;

export type ZoraThemeMode = 'light' | 'dark';

export type ZoraHexColor = `#${string}`;

export const ZORA_COLOR_HARMONIES = [
  'monochromatic',
  'analogous',
  'complementary',
  'splitComplementary',
  'triadic',
  'tetradic',
] as const satisfies readonly ColorHarmony[];

export type ZoraColorHarmony = ColorHarmony;

export const ZORA_COLOR_TONES = [
  'neutral',
  'pastel',
  'earth',
  'mineral',
  'muted',
  'jewel',
  'fluorescent',
  'obsidian',
  'vaporwave',
  'monochromeAccent',
] as const satisfies readonly ColorTone[];

export type ZoraColorTone = ColorTone;

export interface ZoraTheme {
  id: ZoraThemeId;
  name?: string;
  primaryColor: ZoraHexColor;
  harmony: ZoraColorHarmony;
  colorTone: ZoraColorTone;
}

export interface ZoraComputedTheme {
  id: ZoraThemeId;
  name: string;
  mode: ZoraThemeMode;
  source: ZoraTheme;
  surfaceConfig: ThemeConfig;
}
