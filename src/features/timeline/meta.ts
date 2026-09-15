import type { ZoraComponentMeta } from '../../metadata';

export const timelineMeta = {
  name: 'Timeline',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Timeline pattern component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
