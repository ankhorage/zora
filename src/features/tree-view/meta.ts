import type { ZoraComponentMeta } from '../../metadata';

const TREE_NOTE = 'Tree view pattern component; not represented as a manifest node in v1.';

export const treeItemMeta = {
  name: 'TreeItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: TREE_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const treeViewMeta = {
  name: 'TreeView',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: TREE_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
