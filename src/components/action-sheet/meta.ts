import type { ZoraComponentMeta } from '../../metadata';

export const actionSheetMeta = {
  name: 'ActionSheet',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Surface-backed contextual action sheet; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const actionSheetItemMeta = {
  name: 'ActionSheetItem',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Surface-backed contextual action sheet row; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
