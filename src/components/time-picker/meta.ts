import type { ZoraComponentMeta } from '../../metadata';

export const timePickerMeta = {
  name: 'TimePicker',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing ActionSheet-backed time picker; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
