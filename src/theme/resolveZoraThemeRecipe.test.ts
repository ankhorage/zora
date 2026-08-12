import type { ThemeConfig } from '@ankhorage/contracts';
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
    const choiceTheme = runtimeTheme(withRecipes({ components: { Button: { variant: 'neon' } } }));
    expect(() => resolveZoraThemeRecipe(choiceTheme, 'Button')).toThrow(
      'Invalid theme recipe choice',
    );

    const tokenTheme = runtimeTheme(withRecipes({ components: { Card: { padding: 'missing' } } }));
    expect(() => resolveZoraThemeRecipe(tokenTheme, 'Card')).toThrow('Unknown spacing token');
  });

  test('rejects code requests for unknown recipe names', () => {
    expect(() => resolveZoraThemeRecipe(runtimeTheme(baseConfig), 'Missing')).toThrow(
      'Unknown ZORA theme recipe',
    );
  });
});
