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
