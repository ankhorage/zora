import { ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';
import { ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraProviderProps {
  children: React.ReactNode;
  theme?: ZoraTheme;
  initialMode?: ZoraThemeMode;
}

/***
 * Installs the ZORA theme runtime and underlying Surface theme provider.
 *
 * Wrap an app with `ZoraProvider` once near the root so components, patterns,
 * layouts, and theme hooks resolve the same design tokens and color mode.
 *
 * @readme
 * @example App provider
 * ```tsx
 * <ZoraProvider initialMode="light"><App /></ZoraProvider>
 * ```
 */
export function ZoraProvider({
  children,
  theme = zoraDefaultTheme,
  initialMode = 'light',
}: ZoraProviderProps) {
  const runtimeValue = React.useMemo(() => ({ sourceTheme: theme, themeId: theme.id }), [theme]);

  return (
    <ZoraThemeRuntimeContext.Provider value={runtimeValue}>
      <ThemeProvider initialConfig={createZoraThemeConfig(theme)} initialMode={initialMode}>
        {children}
      </ThemeProvider>
    </ZoraThemeRuntimeContext.Provider>
  );
}
