import { describe, expect, test } from 'bun:test';

import {
  ZORA_THEME_RECIPE_META,
  ZORA_THEME_TOKEN_FAMILIES,
  type ZoraThemeRecipeMeta,
} from '../index';
import { ZORA_COMPONENT_REGISTRY } from '../registry';
import { ZORA_COMPONENT_META } from './componentMeta';

const tokenFamilies = new Set<string>(ZORA_THEME_TOKEN_FAMILIES);

function recipe(name: string): ZoraThemeRecipeMeta {
  const value = ZORA_THEME_RECIPE_META[name];
  if (!value) throw new Error(`Missing theme recipe metadata for ${name}.`);
  return value;
}

describe('ZORA_THEME_RECIPE_META', () => {
  test('exports representative component and pattern recipes', () => {
    expect(Object.keys(ZORA_THEME_RECIPE_META)).toEqual(['Button', 'Card', 'Text', 'Panel']);
    expect(recipe('Button').kind).toBe('component');
    expect(recipe('Panel').kind).toBe('pattern');
  });

  test('keeps registry names unique and aligned with component metadata', () => {
    const names = Object.values(ZORA_THEME_RECIPE_META).map((meta) => meta.name);
    expect(new Set(names).size).toBe(names.length);

    for (const [key, meta] of Object.entries(ZORA_THEME_RECIPE_META)) {
      expect(meta.name).toBe(key);
      expect(ZORA_COMPONENT_META[key]?.category).toBe(meta.kind);
    }
  });

  test('references only canonical token families and valid choice defaults', () => {
    for (const meta of Object.values(ZORA_THEME_RECIPE_META)) {
      for (const field of Object.values(meta.fields)) {
        if (field.type === 'token') {
          expect(tokenFamilies.has(field.tokenFamily), `${meta.name}.${field.label}`).toBe(true);
        }
        if (field.type === 'choice') {
          expect(field.options).toContain(field.default);
        }
      }
    }
  });

  test('describes component-specific semantic scales instead of universal geometry', () => {
    expect(recipe('Button').fields.size).toMatchObject({
      type: 'choice',
      options: ['s', 'm', 'l'],
      default: 'm',
    });
    expect(recipe('Card').fields.padding).toMatchObject({
      type: 'token',
      tokenFamily: 'spacing',
      default: 'l',
    });
  });

  test('stays distinct from component metadata and the concrete React registry', () => {
    expect(ZORA_THEME_RECIPE_META).not.toBe(ZORA_COMPONENT_META);
    expect(ZORA_THEME_RECIPE_META).not.toBe(ZORA_COMPONENT_REGISTRY);
    expect(ZORA_COMPONENT_REGISTRY.Button).not.toBe(ZORA_THEME_RECIPE_META.Button);
  });

  test('is serializable for downstream authoring consumers', () => {
    expect(() => JSON.stringify(ZORA_THEME_RECIPE_META)).not.toThrow();
  });
});
