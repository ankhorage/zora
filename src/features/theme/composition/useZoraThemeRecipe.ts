import type { ZoraThemeRecipeMeta } from '../../../types/theme-recipe';
import { resolveZoraThemeRecipe } from '../utils/resolveZoraThemeRecipe';
import { useZoraTheme } from './useZoraTheme';

/*** Resolve one feature-owned theme recipe against the active ZORA theme. */
export function useZoraThemeRecipe(meta: ZoraThemeRecipeMeta) {
  const { theme } = useZoraTheme();
  return resolveZoraThemeRecipe(theme, meta);
}
