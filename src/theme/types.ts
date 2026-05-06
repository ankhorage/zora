import type {
  ColorHarmony,
  GeneratedThemeModeColors,
  GeneratedThemeSwatches,
  SemanticColorToken,
} from '@ankhorage/color-theory';
import type { AppCategory, ThemeConfig } from '@ankhorage/contracts';
import type { SurfaceTheme } from '@ankhorage/surface';

export type ZoraThemeId = string;

export type ZoraThemeMode = 'light' | 'dark';

export interface ZoraTheme {
  id: ZoraThemeId;
  name: string;
  appCategory: AppCategory;
  primaryColor: string;
  harmony: ColorHarmony;
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
