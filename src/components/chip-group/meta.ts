import type { ZoraComponentMeta } from '../../metadata';

export const chipGroupMeta = {
  name: 'ChipGroup',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Selection component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
