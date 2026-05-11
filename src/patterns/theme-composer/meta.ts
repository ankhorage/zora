import type { ZoraComponentMeta } from '../../metadata';

export const themeComposerMeta = {
  name: 'ThemeComposer',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Theme tooling pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
