import type { ZoraComponentMeta } from '../../metadata';

export const toolbarMeta = {
  name: 'Toolbar',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Action bar component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const toolbarActionMeta = {
  name: 'ToolbarAction',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Action bar item; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
