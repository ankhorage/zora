import type { ZoraComponentMeta } from '../../metadata';

const SELECTION_NOTE = 'Selection pattern component; not represented as a manifest node in v1.';

export const selectableItemMeta = {
  name: 'SelectableItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: SELECTION_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const selectionProviderMeta = {
  name: 'SelectionProvider',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: SELECTION_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
