import type { ZoraComponentMeta } from '../../metadata';

export const confirmDialogMeta = {
  name: 'ConfirmDialog',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Dialog pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
