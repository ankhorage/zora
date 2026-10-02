import { expect, test } from 'bun:test';

import { gradientMeta } from './gradientMeta';

test('Gradient is a direct manifest container with serializable colors', () => {
  expect(gradientMeta.directManifestNode).toBe(true);
  expect(gradientMeta.allowedChildren.length).toBeGreaterThan(0);
  expect(gradientMeta.props.colors).toEqual({
    type: 'array',
    category: 'Style',
    label: 'Colors',
  });
});
