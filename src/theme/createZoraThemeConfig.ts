import type { ThemeConfig } from '@ankhorage/surface';

import type { ZoraHexColor, ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

function resolveModePrimaryColor(primaryColor: ZoraHexColor, _mode: ZoraThemeMode): ZoraHexColor {
  // Intentionally conservative in Plan 1: mode-specific primary derivation
  // (OKLCH/lightness scale, etc.) comes in later theme-engine work.
  return primaryColor;
}

export function createZoraThemeConfig(theme: ZoraTheme = zoraDefaultTheme): ThemeConfig {
  return {
    id: theme.id,
    name: theme.name ?? theme.id,
    light: {
      primaryColor: resolveModePrimaryColor(theme.primaryColor, 'light'),
      harmony: theme.harmony,
      systemTone: theme.tone,
    },
    dark: {
      primaryColor: resolveModePrimaryColor(theme.primaryColor, 'dark'),
      harmony: theme.harmony,
      systemTone: theme.tone,
    },
  };
}
