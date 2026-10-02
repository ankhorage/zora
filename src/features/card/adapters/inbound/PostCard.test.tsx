import { describe, expect, test } from 'bun:test';

import { postCardMeta } from '../../postCardMeta';

describe('PostCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(postCardMeta.name).toBe('PostCard');
    expect(postCardMeta.category).toBe('pattern');
    expect(postCardMeta.directManifestNode).toBe(true);
  });
});
