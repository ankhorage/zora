import type { ZoraComponentMeta } from '../../metadata';

export const searchBarMeta = {
  name: 'SearchBar',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Composite input component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
