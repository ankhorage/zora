import type { ZoraComponentMeta } from '../../metadata';

export const badgeMeta = {
  name: 'Badge',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Status/label component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
