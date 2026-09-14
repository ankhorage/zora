import { ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import type { ZoraProviderProps } from '../types/provider';
import { createZoraThemeConfig } from './createZoraThemeConfig';
import { ZoraRuntimeCapabilities } from './ZoraRuntimeCapabilities';
import { zoraDefaultTheme } from './zoraDefaultTheme';
import { ZoraThemeRuntimeContext } from './ZoraThemeRuntimeContext';

export type { ZoraProviderProps, ZoraToastCapability } from '../types/provider';

/*** Installs the core ZORA theme runtime and explicitly enabled optional capabilities. */
export function ZoraProvider({
  bottomSheet = false,
  children,
  theme = zoraDefaultTheme,
  themeConfig,
  initialMode = 'light',
  toast = false,
}: ZoraProviderProps) {
  const resolvedConfig = React.useMemo(
    () => themeConfig ?? createZoraThemeConfig(theme),
    [theme, themeConfig],
  );
  const runtimeValue = React.useMemo(() => ({ themeId: resolvedConfig.id }), [resolvedConfig.id]);

  return (
    <ZoraThemeRuntimeContext value={runtimeValue}>
      <ThemeProvider initialConfig={resolvedConfig} initialMode={initialMode}>
        <ZoraRuntimeCapabilities bottomSheet={bottomSheet} toast={toast}>
          {children}
        </ZoraRuntimeCapabilities>
      </ThemeProvider>
    </ZoraThemeRuntimeContext>
  );
}
