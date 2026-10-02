import type { ThemeConfig, ThemeRecipeOverrideValue } from '@ankhorage/contracts';

import type {
  ZoraThemeRecipeFieldMeta,
  ZoraThemeRecipeMeta,
  ZoraThemeTokenFamily,
} from '../../../types/theme-recipe';

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

/*** Resolve one feature-owned theme recipe against persisted theme overrides. */
export function resolveZoraThemeRecipe(
  theme: ZoraThemeRecipeRuntimeTheme,
  meta: ZoraThemeRecipeMeta,
): Readonly<Record<string, ThemeRecipeOverrideValue>> {
  const recipeName = meta.name;
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

/*** Validate one persisted recipe value against its feature-owned metadata. */
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

/*** Check whether one runtime theme exposes the referenced token. */
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

/*** Check an own property without traversing the prototype chain. */
function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}
