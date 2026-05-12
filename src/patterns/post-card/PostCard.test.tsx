import { describe, expect, test } from 'bun:test';
import React from 'react';

import { ZORA_COMPONENT_META } from '../../metadata';
import { PostCard } from './PostCard';

describe('PostCard', () => {
  test('is registered as a public ZORA pattern', () => {
    expect(ZORA_COMPONENT_META.PostCard?.name).toBe('PostCard');
    expect(ZORA_COMPONENT_META.PostCard?.category).toBe('pattern');
  });

  test('can be created with the minimal public props', () => {
    const element = React.createElement(PostCard, {
      author: { name: 'Ada Lovelace' },
      text: 'Hello from ZORA.',
    });

    expect(element.type).toBe(PostCard);
  });
});
