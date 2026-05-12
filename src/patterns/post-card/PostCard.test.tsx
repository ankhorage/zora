import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../metadata';

describe('PostCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(ZORA_COMPONENT_META.PostCard?.name).toBe('PostCard');
    expect(ZORA_COMPONENT_META.PostCard?.category).toBe('pattern');
    expect(ZORA_COMPONENT_META.PostCard?.directManifestNode).toBe(true);
  });
});
