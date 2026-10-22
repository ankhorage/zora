import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { HeadingSize } from '../../../types/heading';
import { resolveTypographyThemeRecipeFields } from './resolveTypographyThemeRecipeFields';

export function resolveHeadingThemeRecipe(
  fields: Readonly<Record<string, ThemeRecipeOverrideValue>>,
) {
  return {
    size: readSize(fields.size),
    ...resolveTypographyThemeRecipeFields(fields),
  };
}

function readSize(value: ThemeRecipeOverrideValue | undefined): HeadingSize | undefined {
  if (value === 'display' || value === 'h1' || value === 'h2' || value === 'h3') return value;
  if (value === 'h4' || value === 'h5' || value === 'h6') return value;
  return undefined;
}
