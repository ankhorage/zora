from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    target = Path(path)
    text = target.read_text(encoding='utf-8')
    if old not in text:
        raise RuntimeError(f'missing replacement target in {path}: {old!r}')
    target.write_text(text.replace(old, new), encoding='utf-8')

replace(
    'src/components/text/Text.tsx',
    "  return i18nKey || null;",
    "  if (i18nKey === undefined || i18nKey === '') return null;\n  return i18nKey;",
)
replace(
    'src/components/heading/Heading.tsx',
    "  return i18nKey || null;",
    "  if (i18nKey === undefined || i18nKey === '') return null;\n  return i18nKey;",
)
replace(
    'src/components/heading/Heading.tsx',
    "  if (content === null || content === undefined) return null;",
    "  if (content === null) return null;",
)

Path('src/theme/resolveZoraThemeRecipe.ts').write_text(r'''import type { ThemeRecipeOverrideValue } from '@ankhorage/contracts';
import type { SurfaceTheme } from '@ankhorage/surface';

import { ZORA_THEME_RECIPE_META } from '../metadata/themeRecipeMeta';
import type { ZoraThemeRecipeFieldMeta, ZoraThemeTokenFamily } from '../metadata/themeRecipeTypes';

const recipeMetaByName = new Map(Object.entries(ZORA_THEME_RECIPE_META));

export function resolveZoraThemeRecipe(
  theme: SurfaceTheme,
  recipeName: string,
): Readonly<Record<string, ThemeRecipeOverrideValue>> {
  const meta = recipeMetaByName.get(recipeName);
  if (!meta) throw new RangeError(`Unknown ZORA theme recipe: ${recipeName}.`);

  const recipes = meta.kind === 'component' ? theme.config.recipes?.components : theme.config.recipes?.patterns;
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
  theme: SurfaceTheme,
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

function hasThemeToken(theme: SurfaceTheme, family: ZoraThemeTokenFamily, token: string): boolean {
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

Path('src/metadata/authoringMeta.test.ts').write_text(r'''import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentPropAuthoring } from './index';

const componentMetaByName = new Map(Object.entries(ZORA_COMPONENT_META));

describe('ZORA component prop authoring authority', () => {
  test('supports instance and theme authority with explicit instance override capability', () => {
    const values: readonly ZoraComponentPropAuthoring[] = [
      { authority: 'instance' },
      { authority: 'theme', scope: 'global' },
      { authority: 'theme', scope: 'component', allowInstanceOverride: true },
      { authority: 'theme', scope: 'pattern', allowInstanceOverride: true },
    ];
    expect(values).toHaveLength(4);
  });

  test('keeps representative content and semantics instance-owned', () => {
    expect(ZORA_COMPONENT_META.Button.props.children?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Card.props.title?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Heading.props.level?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Text.props.text?.authoring).toEqual({ authority: 'instance' });
  });

  test('marks recipe props theme-owned while allowing explicit instance overrides', () => {
    for (const name of ['Button', 'Card', 'Heading', 'Text', 'Panel']) {
      const meta = componentMetaByName.get(name);
      expect(meta, name).toBeDefined();
      for (const prop of Object.values(meta?.props ?? {})) {
        if (prop.authoring?.authority !== 'theme') continue;
        expect(prop.authoring.allowInstanceOverride, name).toBe(true);
      }
    }
  });

  test('keeps Heading blueprint semantic content useful', () => {
    expect(ZORA_COMPONENT_META.Heading.blueprint?.defaultProps).toEqual({ text: 'Heading', level: 2 });
  });

  test('does not introduce a system authority', () => {
    expect(JSON.stringify(ZORA_COMPONENT_META)).not.toContain('"authority":"system"');
  });
});
''', encoding='utf-8')

Path('src/metadata/themeRecipeMeta.test.ts').write_text(r'''import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META, ZORA_THEME_TOKEN_FAMILIES } from './index';

const tokenFamilies = new Set<string>(ZORA_THEME_TOKEN_FAMILIES);
const recipeMetaByName = new Map(Object.entries(ZORA_THEME_RECIPE_META));

describe('ZORA_THEME_RECIPE_META', () => {
  test('exports every current component/pattern theme-authority recipe', () => {
    expect(Object.keys(ZORA_THEME_RECIPE_META)).toEqual(['Button', 'Card', 'Heading', 'Text', 'Panel']);

    for (const [name, componentMeta] of Object.entries(ZORA_COMPONENT_META)) {
      const themeProps = Object.entries(componentMeta.props).filter(
        ([, prop]) => prop.authoring?.authority === 'theme' && prop.authoring.scope !== 'global',
      );
      if (themeProps.length === 0) continue;

      const recipe = recipeMetaByName.get(name);
      expect(recipe, `${name} has theme props but no theme recipe`).toBeDefined();
      expect(recipe?.kind).toBe(componentMeta.category === 'pattern' ? 'pattern' : 'component');
      const fields = new Map(Object.entries(recipe?.fields ?? {}));
      for (const [propName] of themeProps) {
        expect(fields.get(propName), `${name}.${propName} is missing from its recipe`).toBeDefined();
      }
    }
  });

  test('references only canonical token families and valid declared defaults', () => {
    for (const meta of Object.values(ZORA_THEME_RECIPE_META)) {
      for (const field of Object.values(meta.fields)) {
        if (field.type === 'token') {
          expect(tokenFamilies.has(field.tokenFamily), `${meta.name}.${field.label}`).toBe(true);
        }
        if (field.type === 'choice' && field.default !== undefined) {
          expect(field.options).toContain(field.default);
        }
      }
    }
  });

  test('keeps recipe defaults aligned with existing runtime behavior', () => {
    expect(ZORA_THEME_RECIPE_META.Button?.fields.size?.default).toBe('l');
    expect(ZORA_THEME_RECIPE_META.Card?.fields.padding?.default).toBeUndefined();
    expect(ZORA_THEME_RECIPE_META.Text?.fields.weight?.default).toBeUndefined();
    expect(ZORA_THEME_RECIPE_META.Heading?.fields.size?.default).toBeUndefined();
  });

  test('does not persist theme-owned defaults into new instance blueprints', () => {
    for (const [name, meta] of Object.entries(ZORA_COMPONENT_META)) {
      const props = new Map(Object.entries(meta.props));
      for (const propName of Object.keys(meta.blueprint?.defaultProps ?? {})) {
        expect(
          props.get(propName)?.authoring?.authority,
          `${name}.${propName} blueprint must not pin a theme-owned value`,
        ).not.toBe('theme');
      }
    }
  });

  test('is serializable for downstream authoring consumers', () => {
    expect(() => JSON.stringify(ZORA_THEME_RECIPE_META)).not.toThrow();
  });
});
''', encoding='utf-8')

Path('src/theme/themeConfigScope.test.ts').write_text(r'''import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const themeDir = import.meta.dir;

describe('canonical ThemeConfig scope propagation', () => {
  test('provider accepts and stores the full canonical ThemeConfig', () => {
    const provider = readFileSync(join(themeDir, 'ZoraProvider.tsx'), 'utf8');
    const context = readFileSync(join(themeDir, 'ZoraThemeRuntimeContext.tsx'), 'utf8');
    expect(provider).toContain('themeConfig?: ThemeConfig');
    expect(provider).toContain('themeConfig ?? createZoraThemeConfig(theme)');
    expect(context).toContain('themeConfig: ThemeConfig');
    expect(context).not.toContain('sourceTheme');
  });

  test('nested scopes reuse the full parent config instead of rebuilding a legacy seed', () => {
    const scope = readFileSync(join(themeDir, 'ZoraThemeScope.tsx'), 'utf8');
    expect(scope).toContain('createTheme(parentRuntime.themeConfig');
    expect(scope).not.toContain('createZoraThemeConfig');
    expect(scope).not.toContain('sourceTheme');
  });
});
''', encoding='utf-8')
