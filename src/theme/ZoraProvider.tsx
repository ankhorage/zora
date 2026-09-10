import type { ThemeConfig } from '@ankhorage/contracts';
import { ThemeProvider } from '@ankhorage/surface';
import { BottomSheetProvider } from '@ankhorage/surface/bottom-sheet';
import React from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';
import { ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export interface ZoraProviderProps {
  children: React.ReactNode;
  theme?: ZoraTheme;
  themeConfig?: ThemeConfig;
  initialMode?: ZoraThemeMode;
}

/** Installs the ZORA theme runtime, Surface theme, and shared bottom-sheet controller. */
export function ZoraProvider({
  children,
  theme = zoraDefaultTheme,
  themeConfig,
  initialMode = 'light',
}: ZoraProviderProps) {
  const resolvedConfig = React.useMemo(
    () => themeConfig ?? createZoraThemeConfig(theme),
    [theme, themeConfig],
  );
  const runtimeValue = React.useMemo(() => ({ themeId: resolvedConfig.id }), [resolvedConfig.id]);

  return (
    <ZoraThemeRuntimeContext.Provider value={runtimeValue}>
      <ThemeProvider initialConfig={resolvedConfig} initialMode={initialMode}>
        <BottomSheetProvider>{children}</BottomSheetProvider>
      </ThemeProvider>
    </ZoraThemeRuntimeContext.Provider>
  );
}
