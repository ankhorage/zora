import type { ZoraComponentMeta } from '../../metadata';

export const iconMeta = {
  name: 'Icon',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Icon renderer component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
