import { describe, expect, test } from 'bun:test';

import { resolveButtonRecipe } from './resolveButtonRecipe';

describe('resolveButtonRecipe', () => {
  test('maps defaults to a large solid primary button', () => {
    expect(resolveButtonRecipe({})).toEqual({ size: 'l', color: 'primary', variant: 'solid' });
  });
});
