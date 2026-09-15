import { describe, expect, test } from 'bun:test';

import { resolveBadgeRecipe } from './resolveBadgeRecipe';

describe('resolveBadgeRecipe', () => {
  test('maps defaults to a soft medium primary badge', () => {
    expect(resolveBadgeRecipe({})).toEqual({ size: 'm', color: 'primary', variant: 'soft' });
  });
});
