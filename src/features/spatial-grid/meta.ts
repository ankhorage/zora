import type { ZoraComponentMeta } from '../../types/authoring';

/** Free-placement rendering requires a caller-owned React renderer and is therefore code-only. */
export const spatialGridMeta = {
  name: 'SpatialGrid',
  category: 'foundation',
  description: 'Virtualized free-placement board. Item rendering belongs to the code API.',
  directManifestNode: false,
  note: 'SpatialGrid requires a caller-owned React item renderer and cannot be serialized as a manifest node.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
