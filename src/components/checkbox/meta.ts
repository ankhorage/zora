import type { ZoraComponentMeta } from '../../metadata';

export const checkboxMeta = {
  name: 'Checkbox',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form control component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const checkboxGroupMeta = {
  name: 'CheckboxGroup',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Form control component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
