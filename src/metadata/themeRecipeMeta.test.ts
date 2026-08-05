import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_REGISTRY } from '../registry';
import { ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META, ZORA_THEME_TOKEN_FAMILIES } from './index';

const tokenFamilies = new Set<string>(ZORA_THEME_TOKEN_FAMILIES);
const expectedKinds = new Map<string, 'component' | 'pattern'>([
  ['Button', 'component'],
  ['Card', 'component'],
  ['Text', 'component'],
  ['Panel', 'pattern'],
]);

describe('ZORA_THEME_RECIPE_META', () => {
  test('exports representative component and pattern recipes', () => {
    expect(Object.keys(ZORA_THEME_RECIPE_META)).toEqual(['Button', 'Card', 'Text', 'Panel']);
    expect(ZORA_THEME_RECIPE_META.Button?.kind).toBe('component');
    expect(ZORA_THEME_RECIPE_META.Panel?.kind).toBe('pattern');
  });

  test('keeps registry names unique and aligned with component metadata', () => {
    const names = Object.values(ZORA_THEME_RECIPE_META).map((meta) => meta.name);
    expect(new Set(names).size).toBe(names.length);

    for (const [key, meta] of Object.entries(ZORA_THEME_RECIPE_META)) {
      expect(meta.name).toBe(key);
      expect(meta.kind).toBe(expectedKinds.get(key));
    }

    expect(ZORA_COMPONENT_META.Button.category).toBe('component');
    expect(ZORA_COMPONENT_META.Card.category).toBe('component');
    expect(ZORA_COMPONENT_META.Text.category).toBe('component');
    expect(ZORA_COMPONENT_META.Panel.category).toBe('pattern');
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
    expect(ZORA_THEME_RECIPE_META.Button?.fields.size).toMatchObject({
      type: 'choice',
      options: ['s', 'm', 'l'],
      default: 'm',
    });
    expect(ZORA_THEME_RECIPE_META.Card?.fields.padding).toMatchObject({
      type: 'token',
      tokenFamily: 'spacing',
      default: 'l',
    });
  });

  test('stays distinct from component metadata and the concrete React registry', () => {
    expect(ZORA_THEME_RECIPE_META).not.toBe(ZORA_COMPONENT_META);
    expect(ZORA_THEME_RECIPE_META).not.toBe(ZORA_COMPONENT_REGISTRY);
    expect(typeof ZORA_COMPONENT_REGISTRY.Button).toBe('function');
    expect(typeof ZORA_THEME_RECIPE_META.Button).toBe('object');
  });

  test('is serializable for downstream authoring consumers', () => {
    expect(() => JSON.stringify(ZORA_THEME_RECIPE_META)).not.toThrow();
  });
});
