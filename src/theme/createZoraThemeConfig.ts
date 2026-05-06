import type { ThemeConfig } from '@ankhorage/contracts';

import type { ZoraTheme } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

export function createZoraThemeConfig(theme: ZoraTheme = zoraDefaultTheme): ThemeConfig {
  return {
    id: theme.id,
    name: theme.name,
    light: {
      primaryColor: theme.primaryColor,
      harmony: theme.harmony,
    },
    dark: {
      primaryColor: theme.primaryColor,
      harmony: theme.harmony,
    },
  };
}
