from pathlib import Path

Path('src/theme/resolveZoraThemeRecipe.ts').write_text(r'''import type { ThemeConfig, ThemeRecipeOverrideValue } from '@ankhorage/contracts';

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
    throw new RangeError(`Unknown ${meta.tokenFamily} token for ${recipeName}.${fieldName}: ${value}.`);
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
''', encoding='utf-8')

Path('src/theme/resolveZoraThemeRecipe.test.ts').write_text(r'''import type { ThemeConfig } from '@ankhorage/contracts';
import { describe, expect, test } from 'bun:test';

import { resolveZoraThemeRecipe } from './resolveZoraThemeRecipe';

const baseConfig: ThemeConfig = {
  id: 'test',
  name: 'Test',
  light: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  dark: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  tokens: { spacing: { hero: 64 } },
};

function runtimeTheme(config: ThemeConfig) {
  return {
    config,
    colors: { primary: '#3B82F6' },
    spacing: { m: 16, l: 24, hero: 64 },
    radii: { m: 8, l: 16 },
    shadows: { soft: 2 },
    typography: {
      sizes: { m: 16 },
      weights: { regular: '400' },
      headings: { 1: { size: 32 } },
    },
  };
}

function withRecipes(recipes: ThemeConfig['recipes']): ThemeConfig {
  return { ...baseConfig, recipes };
}

describe('resolveZoraThemeRecipe', () => {
  test('merges metadata defaults with persisted known fields', () => {
    const theme = runtimeTheme(
      withRecipes({ components: { Card: { tone: 'outline', padding: 'hero' } } }),
    );
    expect(resolveZoraThemeRecipe(theme, 'Card')).toEqual({
      tone: 'outline',
      padding: 'hero',
      radius: 'l',
      compact: false,
    });
  });

  test('ignores stale unknown persisted fields without guessing metadata', () => {
    const theme = runtimeTheme(
      withRecipes({ components: { Button: { variant: 'soft', retiredField: 'legacy' } } }),
    );
    expect(resolveZoraThemeRecipe(theme, 'Button')).toEqual({
      color: 'primary',
      variant: 'soft',
      size: 'l',
    });
  });

  test('rejects invalid known choices and token references', () => {
    const choiceTheme = runtimeTheme(
      withRecipes({ components: { Button: { variant: 'neon' } } }),
    );
    expect(() => resolveZoraThemeRecipe(choiceTheme, 'Button')).toThrow(
      'Invalid theme recipe choice',
    );

    const tokenTheme = runtimeTheme(
      withRecipes({ components: { Card: { padding: 'missing' } } }),
    );
    expect(() => resolveZoraThemeRecipe(tokenTheme, 'Card')).toThrow('Unknown spacing token');
  });

  test('rejects code requests for unknown recipe names', () => {
    expect(() => resolveZoraThemeRecipe(runtimeTheme(baseConfig), 'Missing')).toThrow(
      'Unknown ZORA theme recipe',
    );
  });
});
''', encoding='utf-8')
