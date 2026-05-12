import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../metadata';

describe('ChatListItem', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(ZORA_COMPONENT_META.ChatListItem?.name).toBe('ChatListItem');
    expect(ZORA_COMPONENT_META.ChatListItem?.category).toBe('pattern');
    expect(ZORA_COMPONENT_META.ChatListItem?.directManifestNode).toBe(true);
  });
});
