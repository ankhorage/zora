import { resolveZoraThemeRecipe } from '../utils/resolveZoraThemeRecipe';
import { useZoraTheme } from './useZoraTheme';

export function useZoraThemeRecipe(recipeName: string) {
  const { theme } = useZoraTheme();
  return resolveZoraThemeRecipe(theme, recipeName);
}
