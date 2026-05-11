import type { ZoraComponentMeta } from '../../metadata';

export const modalMeta = {
  name: 'Modal',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Overlay component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
