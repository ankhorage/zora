import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '.';

const containers = [
  ['Screen', ZORA_COMPONENT_META.Screen],
  ['ScreenSection', ZORA_COMPONENT_META.ScreenSection],
  ['Box', ZORA_COMPONENT_META.Box],
  ['Stack', ZORA_COMPONENT_META.Stack],
  ['Card', ZORA_COMPONENT_META.Card],
  ['Panel', ZORA_COMPONENT_META.Panel],
] as const;

test('keeps manifest RadioGroup reachable through canonical container composition', () => {
  expect(ZORA_COMPONENT_META.RadioGroup.directManifestNode).toBe(true);

  for (const [name, metadata] of containers) {
    expect(metadata.allowedChildren, `${name} should allow RadioGroup`).toContain('RadioGroup');
  }
});
