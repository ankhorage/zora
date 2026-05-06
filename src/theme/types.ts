import type {
  ColorHarmony,
  GeneratedThemeModeColors,
  GeneratedThemeSwatches,
  HexColor,
  SemanticColorToken,
} from '@ankhorage/color-theory';
import type { AppCategory } from '@ankhorage/contracts';
import type { ThemeConfig } from '@ankhorage/contracts';
import type { SurfaceTheme } from '@ankhorage/surface';

export type ZoraThemeId = string;

export type ZoraThemeMode = 'light' | 'dark';

export const ZORA_COLOR_HARMONIES = [
  'monochromatic',
  'analogous',
  'complementary',
  'splitComplementary',
  'triadic',
  'tetradic',
] as const satisfies readonly ColorHarmony[];

export type ZoraColorHarmony = ColorHarmony;

export interface ZoraTheme {
  id: ZoraThemeId;
  name: string;
  appCategory: AppCategory;
  primaryColor: HexColor;
  harmony: ZoraColorHarmony;
}

export interface ZoraComputedThemeMode {
  mode: ZoraThemeMode;
  surfaceTheme: SurfaceTheme;
  generated: GeneratedThemeModeColors;
  swatches: GeneratedThemeSwatches;
  semanticColors?: Record<SemanticColorToken, string>;
}

export interface ZoraComputedTheme {
  id: ZoraThemeId;
  name: string;
  source: ZoraTheme;
  surfaceConfig: ThemeConfig;
  light: ZoraComputedThemeMode;
  dark: ZoraComputedThemeMode;
}
