import type { ZoraComponentMeta } from '../../metadata';

export const imageMeta = {
  name: 'Image',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Media component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
