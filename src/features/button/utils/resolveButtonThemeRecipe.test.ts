import { describe, expect, test } from 'bun:test';

import { resolveButtonThemeRecipe } from './resolveButtonThemeRecipe';

describe('resolveButtonThemeRecipe', () => {
  test('uses theme defaults without changing the existing hard default', () => {
    expect(
      resolveButtonThemeRecipe({ themeFields: { color: 'primary', variant: 'solid', size: 'l' } }),
    ).toEqual({
      color: 'primary',
      variant: 'solid',
      size: 'l',
    });
  });

  test('lets explicit instance props override theme recipe values', () => {
    expect(
      resolveButtonThemeRecipe({
        color: 'danger',
        size: 's',
        themeFields: { color: 'primary', variant: 'soft', size: 'l' },
      }),
    ).toEqual({ color: 'danger', variant: 'soft', size: 's' });
  });
});
