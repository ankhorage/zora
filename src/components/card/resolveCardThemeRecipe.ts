import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type { ZoraCardTone } from '../../internal/recipes';

export function resolveCardThemeRecipe(input: {
  readonly tone?: ZoraCardTone;
  readonly compact?: boolean;
  readonly padding?: string;
  readonly radius?: string;
  readonly themeFields: Readonly<Record<string, ThemeRecipeOverrideValue>>;
}) {
  const tone = input.tone ?? readTone(input.themeFields.tone) ?? 'default';
  const compact = input.compact ?? readBoolean(input.themeFields.compact) ?? false;
  return {
    tone,
    compact,
    padding: input.padding ?? readString(input.themeFields.padding) ?? (compact ? 'm' : 'l'),
    radius: input.radius ?? readString(input.themeFields.radius) ?? 'l',
  };
}

function readTone(value: ThemeRecipeOverrideValue | undefined): ZoraCardTone | undefined {
  if (value === 'default' || value === 'subtle' || value === 'outline') return value;
  return undefined;
}

function readBoolean(value: ThemeRecipeOverrideValue | undefined): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function readString(value: ThemeRecipeOverrideValue | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
