import type { ZoraComponentMeta } from '../../metadata';

export const iconButtonMeta = {
  name: 'IconButton',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Icon-only action component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
