import type { ZoraComponentMeta } from '../../metadata';

export const responsivePanelMeta = {
  name: 'ResponsivePanel',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Responsive panel pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
