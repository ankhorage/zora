import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from './index';

const containerNames = ['Screen', 'ScreenSection', 'Box', 'Stack', 'Card', 'Panel'] as const;

test('keeps manifest RadioGroup reachable through canonical container composition', () => {
  expect(ZORA_COMPONENT_META.RadioGroup.directManifestNode).toBe(true);

  for (const name of containerNames) {
    expect(
      ZORA_COMPONENT_META[name].allowedChildren,
      `${name} should allow RadioGroup`,
    ).toContain('RadioGroup');
  }
});
