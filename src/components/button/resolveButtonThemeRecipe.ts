import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import {
  resolveButtonRecipe,
  type ZoraButtonVariant,
  type ZoraColor,
  type ZoraControlSize,
} from '../../internal/recipes';

export function resolveButtonThemeRecipe(input: {
  readonly color?: ZoraColor;
  readonly variant?: ZoraButtonVariant;
  readonly size?: ZoraControlSize;
  readonly themeFields: Readonly<Record<string, ThemeRecipeOverrideValue>>;
}) {
  return resolveButtonRecipe({
    color: input.color ?? readColor(input.themeFields.color),
    variant: input.variant ?? readVariant(input.themeFields.variant),
    size: input.size ?? readSize(input.themeFields.size),
  });
}

function readColor(value: ThemeRecipeOverrideValue | undefined): ZoraColor | undefined {
  if (typeof value !== 'string') return undefined;
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info')
    return value;
  return undefined;
}

function readVariant(value: ThemeRecipeOverrideValue | undefined): ZoraButtonVariant | undefined {
  if (value === 'solid' || value === 'outline' || value === 'ghost' || value === 'soft')
    return value;
  return undefined;
}

function readSize(value: ThemeRecipeOverrideValue | undefined): ZoraControlSize | undefined {
  if (value === 's' || value === 'm' || value === 'l') return value;
  return undefined;
}
