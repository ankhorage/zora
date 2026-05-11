import type { ZoraComponentMeta } from '../../metadata';

export const drawerMeta = {
  name: 'Drawer',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Shell/navigation component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
