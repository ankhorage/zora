import type { ZoraComponentMeta } from '../../metadata';

export const filterBarMeta = {
  name: 'FilterBar',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Filtering pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
