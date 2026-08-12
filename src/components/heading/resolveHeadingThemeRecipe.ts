import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type {
  HeadingAlign,
  HeadingColor,
  HeadingEmphasis,
  HeadingSize,
  HeadingWeight,
} from './types';

export function resolveHeadingThemeRecipe(
  fields: Readonly<Record<string, ThemeRecipeOverrideValue>>,
) {
  return {
    size: readSize(fields.size),
    color: readColor(fields.color),
    emphasis: readEmphasis(fields.emphasis),
    align: readAlign(fields.align),
    weight: readWeight(fields.weight),
    italic: typeof fields.italic === 'boolean' ? fields.italic : undefined,
  };
}

function readSize(value: ThemeRecipeOverrideValue | undefined): HeadingSize | undefined {
  if (value === 'display' || value === 'h1' || value === 'h2' || value === 'h3') return value;
  if (value === 'h4' || value === 'h5' || value === 'h6') return value;
  return undefined;
}

function readColor(value: ThemeRecipeOverrideValue | undefined): HeadingColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info')
    return value;
  return undefined;
}

function readEmphasis(value: ThemeRecipeOverrideValue | undefined): HeadingEmphasis | undefined {
  if (value === 'default' || value === 'muted' || value === 'subtle' || value === 'inverse')
    return value;
  return undefined;
}

function readAlign(value: ThemeRecipeOverrideValue | undefined): HeadingAlign | undefined {
  if (value === 'auto' || value === 'left' || value === 'right') return value;
  if (value === 'center' || value === 'justify') return value;
  return undefined;
}

function readWeight(value: ThemeRecipeOverrideValue | undefined): HeadingWeight | undefined {
  if (value === 'regular' || value === 'medium' || value === 'semiBold' || value === 'bold')
    return value;
  return undefined;
}
