import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

test('Gradient is a direct manifest container with serializable colors', () => {
  const meta = ZORA_COMPONENT_META.Gradient;

  expect(meta?.directManifestNode).toBe(true);
  expect(meta?.allowedChildren.length).toBeGreaterThan(0);
  expect(meta?.props.colors).toEqual({
    type: 'array',
    category: 'Style',
    label: 'Colors',
  });
});
