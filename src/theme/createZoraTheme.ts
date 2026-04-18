import type { ThemeConfig } from '@ankhorage/surface';

import { deepMerge } from '../internal/deepMerge';
import { zoraTheme } from './zoraTheme';

export type ZoraThemeOverride = Partial<ThemeConfig>;

export function createZoraTheme(overrides: ZoraThemeOverride = {}): ThemeConfig {
  return deepMerge(zoraTheme, overrides);
}
