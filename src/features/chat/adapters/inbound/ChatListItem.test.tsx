import { describe, expect, test } from 'bun:test';

import { chatListItemMeta } from '../../chatListItemMeta';

describe('ChatListItem', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(chatListItemMeta.name).toBe('ChatListItem');
    expect(chatListItemMeta.category).toBe('pattern');
    expect(chatListItemMeta.directManifestNode).toBe(true);
  });
});
