import type { ZoraComponentMeta } from '../../metadata';

export const radioMeta = {
  name: 'Radio',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form control component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const radioGroupMeta = {
  name: 'RadioGroup',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form control component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
