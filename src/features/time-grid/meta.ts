import type { ZoraComponentMeta } from '../../types/authoring';

/** TimeGrid remains code-only because interval and lane presentation require executable renderers. */
export const timeGridMeta = {
  name: 'TimeGrid',
  category: 'foundation',
  description: 'Virtualized variable-height world-space interval lanes for code-defined timelines.',
  directManifestNode: false,
  note: 'Requires executable interval and optional lane-label renderers; available through code APIs, not a serializable manifest node.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
