import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { TextAlign, TextColor, TextEmphasis, TextVariant, TextWeight } from './types';

export function resolveTextThemeRecipe(fields: Readonly<Record<string, ThemeRecipeOverrideValue>>) {
  return {
    variant: readVariant(fields.variant),
    color: readColor(fields.color),
    emphasis: readEmphasis(fields.emphasis),
    align: readAlign(fields.align),
    weight: readWeight(fields.weight),
    italic: typeof fields.italic === 'boolean' ? fields.italic : undefined,
  };
}

function readVariant(value: ThemeRecipeOverrideValue | undefined): TextVariant | undefined {
  if (value === 'body' || value === 'lead' || value === 'bodySmall' || value === 'caption')
    return value;
  if (value === 'label' || value === 'eyebrow' || value === 'code') return value;
  return undefined;
}

function readColor(value: ThemeRecipeOverrideValue | undefined): TextColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info')
    return value;
  return undefined;
}

function readEmphasis(value: ThemeRecipeOverrideValue | undefined): TextEmphasis | undefined {
  if (value === 'default' || value === 'muted' || value === 'subtle' || value === 'inverse')
    return value;
  return undefined;
}

function readAlign(value: ThemeRecipeOverrideValue | undefined): TextAlign | undefined {
  if (value === 'auto' || value === 'left' || value === 'right') return value;
  if (value === 'center' || value === 'justify') return value;
  return undefined;
}

function readWeight(value: ThemeRecipeOverrideValue | undefined): TextWeight | undefined {
  if (value === 'regular' || value === 'medium' || value === 'semiBold' || value === 'bold')
    return value;
  return undefined;
}
