import { parseHexColorOrThrow } from '@ankhorage/color-theory';
import type { ThemeConfig } from '@ankhorage/contracts';

import type { ZoraTheme } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

export function createZoraThemeConfig(theme: ZoraTheme = zoraDefaultTheme): ThemeConfig {
  const primaryColor = parseHexColorOrThrow(theme.primaryColor);

  return {
    id: theme.id,
    name: theme.name,
    light: {
      primaryColor,
      harmony: theme.harmony,
    },
    dark: {
      primaryColor,
      harmony: theme.harmony,
    },
  };
}
