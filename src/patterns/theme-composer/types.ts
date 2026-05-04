import type { ZoraColorHarmony, ZoraColorTone, ZoraTheme, ZoraThemeMode } from '../../theme/types';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ThemeComposerAppCategory = string;
export type ThemeComposerAppMood = string;

export interface ThemeComposerRecommendation {
  appCategory: ThemeComposerAppCategory;
  appMood: ThemeComposerAppMood;
  suggestedColorTone: ZoraColorTone;
  suggestedHarmony: ZoraColorHarmony;
  suggestedPrimaryHueDegrees?: number;
}

export interface ThemeComposerProps extends ZoraBaseProps {
  value: ZoraTheme;
  onChange: (theme: ZoraTheme) => void;
  mode?: ZoraThemeMode;
  onModeChange?: (mode: ZoraThemeMode) => void;
  onSubmit?: (theme: ZoraTheme) => void;
  appCategory?: ThemeComposerAppCategory;
  appMood?: ThemeComposerAppMood;
  recommendations?: readonly ThemeComposerRecommendation[];
}
