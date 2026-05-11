import type { ZoraComponentMeta } from '../../metadata';

const TILE_GRID_NOTE = 'Tile grid pattern component; not represented as a manifest node in v1.';

export const paletteItemMeta = {
  name: 'PaletteItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: TILE_GRID_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const tileGridMeta = {
  name: 'TileGrid',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: TILE_GRID_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
