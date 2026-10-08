import type { ZoraComponentMeta } from '../../types/authoring';

/** Code-only render callbacks are deliberately excluded from the serializable manifest boundary. */
export const gridViewMeta = {
  name: 'GridView',
  category: 'foundation',
  description: 'Viewport renderer for world-placed items. Render callbacks belong to code APIs.',
  directManifestNode: false,
  note: 'Requires executable renderItem callbacks; available through code APIs, not a serializable manifest node.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;

export const tileGridMeta = {
  name: 'TileGrid',
  category: 'foundation',
  description: 'Virtualized tile composition. Item rendering is a code API.',
  directManifestNode: false,
  note: 'Requires a renderItem callback; use MediaExplorer or FileExplorer for manifest-authored tiles.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
