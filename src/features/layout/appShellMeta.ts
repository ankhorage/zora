import type { ZoraComponentMeta } from '../../metadata';

export const appShellMeta = {
  name: 'AppShell',
  category: 'layout',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Application shell layout; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
