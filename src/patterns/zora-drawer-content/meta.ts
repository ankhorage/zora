import type { ZoraComponentMeta } from '../../metadata';

export const zoraDrawerContentMeta = {
  name: 'ZoraDrawerContent',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Navigation chrome pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
