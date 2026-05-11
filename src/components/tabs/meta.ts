import type { ZoraComponentMeta } from '../../metadata';

export const tabsMeta = {
  name: 'Tabs',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Navigation component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
