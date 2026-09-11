import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { ZoraColor } from '../../../../internal/colorModel';
import type { RadioGroupProps } from '../../../../types/radio';

type RadioGroupGap = NonNullable<RadioGroupProps<string>['gap']>;
type RadioGroupSize = NonNullable<RadioGroupProps<string>['size']>;

/***
 * Resolves RadioGroup presentation props from instance overrides and the active theme recipe.
 */
export function resolveRadioGroupThemeRecipe(input: {
  readonly gap?: RadioGroupGap;
  readonly color?: ZoraColor;
  readonly size?: RadioGroupSize;
  readonly themeFields: Readonly<Record<string, ThemeRecipeOverrideValue>>;
}) {
  return {
    gap: input.gap ?? readGap(input.themeFields.gap) ?? 's',
    color: input.color ?? readColor(input.themeFields.color) ?? 'primary',
    size: input.size ?? readSize(input.themeFields.size) ?? 'm',
  } as const;
}

/*** Reads a valid RadioGroup gap from a theme recipe value. */
function readGap(value: ThemeRecipeOverrideValue | undefined): RadioGroupGap | undefined {
  if (value === 'xs' || value === 's' || value === 'm' || value === 'l') return value;
  return undefined;
}

/*** Reads a valid ZORA color from a theme recipe value. */
function readColor(value: ThemeRecipeOverrideValue | undefined): ZoraColor | undefined {
  if (value === 'primary' || value === 'secondary' || value === 'tertiary') return value;
  if (value === 'quaternary' || value === 'neutral' || value === 'danger') return value;
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'info') {
    return value;
  }
  return undefined;
}

/*** Reads a valid RadioGroup control size from a theme recipe value. */
function readSize(value: ThemeRecipeOverrideValue | undefined): RadioGroupSize | undefined {
  if (value === 's' || value === 'm' || value === 'l') return value;
  return undefined;
}
