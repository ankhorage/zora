import { parseHexColorOrThrow } from '@ankhorage/color-theory';
import type { ThemeConfig } from '@ankhorage/contracts';

import type { ZoraTheme } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

/*** Convert the concise ZORA design seed into canonical persisted theme source. */
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
