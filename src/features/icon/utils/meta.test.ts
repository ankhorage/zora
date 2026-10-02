import { expect, test } from 'bun:test';

import { CONTAINER_ALLOWED_CHILDREN } from '../../../constants/authoring';
import { iconMeta } from '../iconMeta';

test('permits media-backed Icon and Image content in ordinary containers', () => {
  expect(iconMeta.directManifestNode).toBe(true);
  expect(iconMeta.allowedChildren).toEqual([]);
  expect(iconMeta.props.source).toMatchObject({ type: 'media', mediaKinds: ['image'] });
  expect(CONTAINER_ALLOWED_CHILDREN).toContain('Icon');
  expect(CONTAINER_ALLOWED_CHILDREN).toContain('Image');
});
