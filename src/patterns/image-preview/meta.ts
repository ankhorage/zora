import type { ZoraComponentMeta } from '../../metadata';

export const imagePreviewMeta = {
  name: 'ImagePreview',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Media pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
