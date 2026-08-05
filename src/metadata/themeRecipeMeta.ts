import { buttonThemeRecipeMeta } from '../components/button/themeRecipeMeta';
import { cardThemeRecipeMeta } from '../components/card/themeRecipeMeta';
import { textThemeRecipeMeta } from '../components/text/themeRecipeMeta';
import { panelThemeRecipeMeta } from '../patterns/panel/themeRecipeMeta';
import type { ZoraThemeRecipeMetaRegistry } from './themeRecipeTypes';

export const ZORA_THEME_RECIPE_META: ZoraThemeRecipeMetaRegistry = {
  Button: buttonThemeRecipeMeta,
  Card: cardThemeRecipeMeta,
  Text: textThemeRecipeMeta,
  Panel: panelThemeRecipeMeta,
};
