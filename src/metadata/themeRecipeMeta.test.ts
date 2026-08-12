import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META, ZORA_THEME_TOKEN_FAMILIES } from './index';

const tokenFamilies = new Set<string>(ZORA_THEME_TOKEN_FAMILIES);
const recipeMetaByName = new Map(Object.entries(ZORA_THEME_RECIPE_META));

describe('ZORA_THEME_RECIPE_META', () => {
  test('exports every current component/pattern theme-authority recipe', () => {
    expect(Object.keys(ZORA_THEME_RECIPE_META)).toEqual([
      'Button',
      'Card',
      'Heading',
      'Text',
      'Panel',
    ]);

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
        expect(
          fields.get(propName),
          `${name}.${propName} is missing from its recipe`,
        ).toBeDefined();
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
