import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../metadata';

describe('ProductCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(ZORA_COMPONENT_META.ProductCard?.name).toBe('ProductCard');
    expect(ZORA_COMPONENT_META.ProductCard?.category).toBe('pattern');
    expect(ZORA_COMPONENT_META.ProductCard?.directManifestNode).toBe(true);
  });
});
