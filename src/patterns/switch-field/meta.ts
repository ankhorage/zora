import type { ZoraComponentMeta } from '../../metadata';

export const switchFieldMeta = {
  name: 'SwitchField',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
