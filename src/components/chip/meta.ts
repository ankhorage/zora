import type { ZoraComponentMeta } from '../../metadata';

export const chipMeta = {
  name: 'Chip',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Tag-like component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
