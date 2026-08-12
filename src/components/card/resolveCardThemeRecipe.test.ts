import { describe, expect, test } from 'bun:test';

import { resolveCardThemeRecipe } from './resolveCardThemeRecipe';

describe('resolveCardThemeRecipe', () => {
  test('preserves compact-aware padding when theme padding is unset', () => {
    expect(
      resolveCardThemeRecipe({ themeFields: { tone: 'default', compact: true, radius: 'l' } }),
    ).toEqual({
      tone: 'default',
      compact: true,
      padding: 'm',
      radius: 'l',
    });
  });

  test('lets explicit instance props win over theme values', () => {
    expect(
      resolveCardThemeRecipe({
        tone: 'outline',
        compact: false,
        padding: 'hero',
        radius: 'pill',
        themeFields: { tone: 'subtle', compact: true, padding: 'm', radius: 'l' },
      }),
    ).toEqual({ tone: 'outline', compact: false, padding: 'hero', radius: 'pill' });
  });
});
