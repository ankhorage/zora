import type { ZoraComponentMeta } from '../../metadata';

export const sidebarLayoutMeta = {
  name: 'SidebarLayout',
  category: 'layout',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Application layout; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
