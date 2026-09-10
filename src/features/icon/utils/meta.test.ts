import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../../../metadata/componentMeta';

test('permits media-backed Icon and Image content in ordinary screen containers', () => {
  const icon = ZORA_COMPONENT_META.Icon;
  expect(icon.directManifestNode).toBe(true);
  expect(icon.allowedChildren).toEqual([]);
  expect(icon.props.source).toMatchObject({ type: 'media', mediaKinds: ['image'] });
  for (const container of [
    ZORA_COMPONENT_META.Box,
    ZORA_COMPONENT_META.Stack,
    ZORA_COMPONENT_META.Grid,
    ZORA_COMPONENT_META.Container,
    ZORA_COMPONENT_META.Card,
    ZORA_COMPONENT_META.Screen,
    ZORA_COMPONENT_META.ScreenSection,
  ]) {
    expect(container.allowedChildren).toContain('Icon');
    expect(container.allowedChildren).toContain('Image');
  }
});
