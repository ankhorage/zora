import type { ZoraComponentMeta } from '../../metadata';

export const appBarMeta = {
  name: 'AppBar',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Application chrome component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
