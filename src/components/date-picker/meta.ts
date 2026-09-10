import type { ZoraComponentMeta } from '../../metadata';

export const datePickerMeta = {
  name: 'DatePicker',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing BottomSheet-backed date picker; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
