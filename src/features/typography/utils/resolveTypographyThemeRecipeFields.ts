import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import { ZORA_COLORS, ZORA_EMPHASES } from '../../theme/colorModel';

const ALIGNMENTS = ['auto', 'left', 'right', 'center', 'justify'] as const;
const WEIGHTS = ['regular', 'medium', 'semiBold', 'bold'] as const;

/*** Resolves the common scalar presentation fields in Typography theme recipes. */
export function resolveTypographyThemeRecipeFields(
  fields: Readonly<Record<string, ThemeRecipeOverrideValue>>,
) {
  return {
    color: readChoice(fields.color, ZORA_COLORS),
    emphasis: readChoice(fields.emphasis, ZORA_EMPHASES),
    align: readChoice(fields.align, ALIGNMENTS),
    weight: readChoice(fields.weight, WEIGHTS),
    italic: typeof fields.italic === 'boolean' ? fields.italic : undefined,
  };
}

function readChoice<T extends string>(
  value: ThemeRecipeOverrideValue | undefined,
  choices: readonly T[],
): T | undefined {
  if (typeof value !== 'string') return undefined;
  return choices.find((choice) => choice === value);
}
