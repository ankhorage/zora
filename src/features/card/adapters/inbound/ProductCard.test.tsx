import { describe, expect, test } from 'bun:test';

import { productCardMeta } from '../../productCardMeta';

describe('ProductCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(productCardMeta.name).toBe('ProductCard');
    expect(productCardMeta.category).toBe('pattern');
    expect(productCardMeta.directManifestNode).toBe(true);
    expect(productCardMeta.allowedChildren).toEqual([]);
    expect(productCardMeta.requirements).toBeUndefined();
  });

  test('has correct event metadata', () => {
    expect(productCardMeta.events?.press).toBeDefined();
    expect(productCardMeta.events?.primaryAction).toBeDefined();
    expect(productCardMeta.events?.secondaryAction).toBeDefined();
  });
});
