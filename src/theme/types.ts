import type { ThemeConfig } from '@ankhorage/surface';

export type ZoraThemeId = string;

export type ZoraThemeMode = 'light' | 'dark';

export type ZoraHexColor = `#${string}`;

export type ZoraColorHarmony =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'splitComplementary'
  | 'triadic'
  | 'tetradic';

export type ZoraColorTone = 'neutral' | 'pastel' | 'earth' | 'jewel' | 'fluorescent';

export interface ZoraTheme {
  id: ZoraThemeId;
  name?: string;
  primaryColor: ZoraHexColor;
  harmony: ZoraColorHarmony;
  tone: ZoraColorTone;
}

export interface ZoraComputedTheme {
  id: ZoraThemeId;
  name: string;
  mode: ZoraThemeMode;
  source: ZoraTheme;
  surfaceConfig: ThemeConfig;
}
