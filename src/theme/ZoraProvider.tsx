import { ThemeProvider } from '@ankhorage/surface';
import React from 'react';

import { createZoraTheme, type ZoraThemeOverride } from './createZoraTheme';

export interface ZoraProviderProps {
  children: React.ReactNode;
  initialConfig?: ZoraThemeOverride;
  initialMode?: 'light' | 'dark';
}

export function ZoraProvider({
  children,
  initialConfig,
  initialMode = 'light',
}: ZoraProviderProps) {
  return (
    <ThemeProvider initialConfig={createZoraTheme(initialConfig)} initialMode={initialMode}>
      {children}
    </ThemeProvider>
  );
}
