import type { ZoraComponentMeta } from '../../metadata';

export const gradientMeta = {
  name: 'Gradient',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Gradient background container; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
