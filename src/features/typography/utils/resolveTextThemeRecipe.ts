import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { TextVariant } from '../../../types/text';
import { resolveTypographyThemeRecipeFields } from './resolveTypographyThemeRecipeFields';

export function resolveTextThemeRecipe(fields: Readonly<Record<string, ThemeRecipeOverrideValue>>) {
  return {
    variant: readVariant(fields.variant),
    ...resolveTypographyThemeRecipeFields(fields),
  };
}

function readVariant(value: ThemeRecipeOverrideValue | undefined): TextVariant | undefined {
  if (value === 'body' || value === 'lead' || value === 'bodySmall' || value === 'caption')
    return value;
  if (value === 'label' || value === 'eyebrow' || value === 'code') return value;
  return undefined;
}
