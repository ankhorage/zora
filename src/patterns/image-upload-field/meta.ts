import type { ZoraComponentMeta } from '../../metadata';

export const imageUploadFieldMeta = {
  name: 'ImageUploadField',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Media upload pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
