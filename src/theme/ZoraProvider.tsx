import { ResponsiveProvider, ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraTheme, ZoraThemeMode } from './types';
import { zoraDefaultTheme } from './zoraDefaultTheme';

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
  return (
    <ThemeProvider initialConfig={createZoraThemeConfig(theme)} initialMode={initialMode}>
      <ResponsiveProvider>{children}</ResponsiveProvider>
    </ThemeProvider>
  );
}
