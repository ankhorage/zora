import type { ThemeConfig, ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import { ZORA_THEME_RECIPE_META } from '../metadata/themeRecipeMeta';
import type { ZoraThemeRecipeFieldMeta, ZoraThemeTokenFamily } from '../metadata/themeRecipeTypes';

interface ZoraThemeRecipeRuntimeTheme {
  readonly config: ThemeConfig;
  readonly colors: object;
  readonly spacing: object;
  readonly radii: object;
  readonly shadows: object;
  readonly typography: {
    readonly sizes: object;
    readonly weights: object;
    readonly headings: object;
  };
}

const recipeMetaByName = new Map(Object.entries(ZORA_THEME_RECIPE_META));

export function resolveZoraThemeRecipe(
  theme: ZoraThemeRecipeRuntimeTheme,
  recipeName: string,
): Readonly<Record<string, ThemeRecipeOverrideValue>> {
  const meta = recipeMetaByName.get(recipeName);
  if (!meta) throw new RangeError(`Unknown ZORA theme recipe: ${recipeName}.`);

  const recipes =
    meta.kind === 'component' ? theme.config.recipes?.components : theme.config.recipes?.patterns;
  const overrides = new Map(Object.entries(recipes ?? {})).get(recipeName);
  const overrideByField = new Map(Object.entries(overrides ?? {}));
  const resolved: [string, ThemeRecipeOverrideValue][] = [];

  for (const [fieldName, fieldMeta] of Object.entries(meta.fields)) {
    const override = overrideByField.get(fieldName);
    if (override !== undefined) {
      validateFieldValue(theme, recipeName, fieldName, fieldMeta, override);
      resolved.push([fieldName, override]);
    } else if (fieldMeta.default !== undefined) {
      resolved.push([fieldName, fieldMeta.default]);
    }
  }

  return Object.fromEntries(resolved);
}

function validateFieldValue(
  theme: ZoraThemeRecipeRuntimeTheme,
  recipeName: string,
  fieldName: string,
  meta: ZoraThemeRecipeFieldMeta,
  value: ThemeRecipeOverrideValue,
): void {
  if (meta.type === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new TypeError(`Theme recipe ${recipeName}.${fieldName} must be boolean.`);
    }
    return;
  }
  if (typeof value !== 'string') {
    throw new TypeError(`Theme recipe ${recipeName}.${fieldName} must be a string.`);
  }
  if (meta.type === 'choice' && !meta.options.includes(value)) {
    throw new RangeError(`Invalid theme recipe choice for ${recipeName}.${fieldName}: ${value}.`);
  }
  if (meta.type === 'token' && !hasThemeToken(theme, meta.tokenFamily, value)) {
    throw new RangeError(
      `Unknown ${meta.tokenFamily} token for ${recipeName}.${fieldName}: ${value}.`,
    );
  }
}

function hasThemeToken(
  theme: ZoraThemeRecipeRuntimeTheme,
  family: ZoraThemeTokenFamily,
  token: string,
): boolean {
  if (family === 'colors') return hasOwn(theme.colors, token);
  if (family === 'spacing') return hasOwn(theme.spacing, token);
  if (family === 'radii') return hasOwn(theme.radii, token);
  if (family === 'shadows') return hasOwn(theme.shadows, token);
  return (
    hasOwn(theme.typography.sizes, token) ||
    hasOwn(theme.typography.weights, token) ||
    hasOwn(theme.typography.headings, token)
  );
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}
