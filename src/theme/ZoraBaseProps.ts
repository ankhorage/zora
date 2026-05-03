import type { ZoraThemeId, ZoraThemeMode } from './types';

export interface ZoraBaseProps {
  /**
   * Overrides the active ZORA theme for this component and its subtree.
   * If omitted, the nearest parent theme is inherited.
   *
   * Plan 2: theme registries are not available yet. Only the inherited theme id
   * is valid; unknown ids throw in dev/test and warn+fallback in production.
   */
  themeId?: ZoraThemeId;

  /**
   * Overrides the light/dark mode for this component and its subtree.
   * If omitted, the nearest parent mode is inherited.
   */
  mode?: ZoraThemeMode;

  testID?: string;
}
