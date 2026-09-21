import type { ThemeConfig } from '@ankhorage/contracts';
import type { ToastProviderProps as SurfaceToastProviderProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraTheme, ZoraThemeMode } from './theme';

export type ZoraToastCapability = boolean | Omit<SurfaceToastProviderProps, 'children'>;

export interface ZoraProviderProps {
  children: React.ReactNode;
  theme?: ZoraTheme;
  themeConfig?: ThemeConfig;
  initialMode?: ZoraThemeMode;
  mode?: ZoraThemeMode;
  toast?: ZoraToastCapability;
  bottomSheet?: boolean;
}

export interface ZoraRuntimeCapabilitiesProps {
  children: React.ReactNode;
  toast?: ZoraToastCapability;
  bottomSheet?: boolean;
}
