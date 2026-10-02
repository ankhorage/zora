import type { ZoraComponentMeta } from '../../types/authoring';

export const paletteItemMeta = {
  name: 'PaletteItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Palette option pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
