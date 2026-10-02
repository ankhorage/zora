import type { ZoraThemeRecipeMetaRegistry } from '../../types/theme-recipe';
import { buttonThemeRecipeMeta } from '../button/utils/themeRecipeMeta';
import { cardThemeRecipeMeta } from '../card/utils/themeRecipeMeta';
import { radioGroupThemeRecipeMeta } from '../form/radio/themeRecipeMeta';
import { headingThemeRecipeMeta } from '../typography/utils/headingThemeRecipeMeta';
import { textThemeRecipeMeta } from '../typography/utils/textThemeRecipeMeta';

export const ZORA_THEME_RECIPE_META: ZoraThemeRecipeMetaRegistry = {
  Button: buttonThemeRecipeMeta,
  Card: cardThemeRecipeMeta,
  Heading: headingThemeRecipeMeta,
  RadioGroup: radioGroupThemeRecipeMeta,
  Text: textThemeRecipeMeta,
};
