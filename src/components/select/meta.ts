import type { ZoraComponentMeta } from '../../metadata';

export const selectMeta = {
  name: 'Select',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form control component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
