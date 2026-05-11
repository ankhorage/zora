import type { ZoraComponentMeta } from '../../metadata';

export const navigationListMeta = {
  name: 'NavigationList',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Navigation chrome component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
