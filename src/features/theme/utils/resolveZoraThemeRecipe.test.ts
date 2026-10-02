import type { ThemeConfig } from '@ankhorage/contracts';
import { describe, expect, test } from 'bun:test';

import type { ZoraThemeRecipeMeta } from '../../../types/theme-recipe';
import { resolveZoraThemeRecipe } from './resolveZoraThemeRecipe';

const baseConfig: ThemeConfig = {
  id: 'test',
  name: 'Test',
  light: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  dark: { primaryColor: '#3B82F6', harmony: 'monochromatic' },
  tokens: { spacing: { hero: 64 } },
};

const buttonRecipeMeta = {
  name: 'Button',
  kind: 'component',
  fields: {
    color: { type: 'choice', label: 'Color', options: ['primary', 'danger'], default: 'primary' },
    variant: { type: 'choice', label: 'Variant', options: ['solid', 'soft'], default: 'solid' },
    size: { type: 'choice', label: 'Size', options: ['s', 'm', 'l'], default: 'l' },
  },
} as const satisfies ZoraThemeRecipeMeta;

const cardRecipeMeta = {
  name: 'Card',
  kind: 'component',
  fields: {
    tone: {
      type: 'choice',
      label: 'Tone',
      options: ['default', 'outline'],
      default: 'default',
    },
    padding: { type: 'token', label: 'Padding', tokenFamily: 'spacing' },
    radius: { type: 'token', label: 'Radius', tokenFamily: 'radii', default: 'l' },
    compact: { type: 'boolean', label: 'Compact', default: false },
  },
} as const satisfies ZoraThemeRecipeMeta;

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

/*** Add persisted recipes to the reusable test theme config. */
function withRecipes(recipes: ThemeConfig['recipes']): ThemeConfig {
  return { ...baseConfig, recipes };
}

describe('resolveZoraThemeRecipe', () => {
  test('merges metadata defaults with persisted known fields', () => {
    const theme = runtimeTheme(
      withRecipes({ components: { Card: { tone: 'outline', padding: 'hero' } } }),
    );
    expect(resolveZoraThemeRecipe(theme, cardRecipeMeta)).toEqual({
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
    expect(resolveZoraThemeRecipe(theme, buttonRecipeMeta)).toEqual({
      color: 'primary',
      variant: 'soft',
      size: 'l',
    });
  });

  test('rejects invalid known choices and token references', () => {
    const choiceTheme = runtimeTheme(withRecipes({ components: { Button: { variant: 'neon' } } }));
    expect(() => resolveZoraThemeRecipe(choiceTheme, buttonRecipeMeta)).toThrow(
      'Invalid theme recipe choice',
    );

    const tokenTheme = runtimeTheme(withRecipes({ components: { Card: { padding: 'missing' } } }));
    expect(() => resolveZoraThemeRecipe(tokenTheme, cardRecipeMeta)).toThrow(
      'Unknown spacing token',
    );
  });

  test('resolves pattern recipes from the pattern namespace', () => {
    const patternMeta = {
      name: 'Hero',
      kind: 'pattern',
      fields: {
        compact: { type: 'boolean', label: 'Compact', default: false },
      },
    } as const satisfies ZoraThemeRecipeMeta;
    const theme = runtimeTheme(withRecipes({ patterns: { Hero: { compact: true } } }));

    expect(resolveZoraThemeRecipe(theme, patternMeta)).toEqual({ compact: true });
  });
});
