import type { ThemeConfig } from '@ankhorage/surface';

import { resolveModePrimaryColor } from '../internal/color';
import type { ZoraTheme } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

export function createZoraThemeConfig(theme: ZoraTheme = zoraDefaultTheme): ThemeConfig {
  return {
    id: theme.id,
    name: theme.name ?? theme.id,
    light: {
      primaryColor: resolveModePrimaryColor(theme.primaryColor, 'light'),
      harmony: theme.harmony,
      colorTone: theme.colorTone,
    },
    dark: {
      primaryColor: resolveModePrimaryColor(theme.primaryColor, 'dark'),
      harmony: theme.harmony,
      colorTone: theme.colorTone,
    },
  };
}
