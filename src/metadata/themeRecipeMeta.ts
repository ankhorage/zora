import { radioGroupThemeRecipeMeta } from '../features/form/radio/themeRecipeMeta';
import { buttonThemeRecipeMeta } from '../features/button/utils/themeRecipeMeta';
import { cardThemeRecipeMeta } from '../features/card/utils/themeRecipeMeta';
import { headingThemeRecipeMeta } from '../features/typography/utils/headingThemeRecipeMeta';
import { textThemeRecipeMeta } from '../features/typography/utils/textThemeRecipeMeta';
import { panelThemeRecipeMeta } from '../patterns/panel/themeRecipeMeta';
import type { ZoraThemeRecipeMetaRegistry } from './themeRecipeTypes';

export const ZORA_THEME_RECIPE_META: ZoraThemeRecipeMetaRegistry = {
  Button: buttonThemeRecipeMeta,
  Card: cardThemeRecipeMeta,
  Heading: headingThemeRecipeMeta,
  RadioGroup: radioGroupThemeRecipeMeta,
  Text: textThemeRecipeMeta,
  Panel: panelThemeRecipeMeta,
};
