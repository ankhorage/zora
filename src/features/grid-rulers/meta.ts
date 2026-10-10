import type { ZoraComponentMeta } from '../../types/authoring';

const GRID_RULERS_NOTE =
  'Requires a live viewport and optional executable tick/label providers; available through code APIs, not a serializable manifest node.';

/** Passive viewport decorations intentionally remain outside direct manifest authoring. */
export const gridLineOverlayMeta = {
  name: 'GridLineOverlay',
  category: 'foundation',
  description: 'Projects bounded world-grid lines and explicit guides from a supplied viewport.',
  directManifestNode: false,
  note: GRID_RULERS_NOTE,
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;

/** Rulers accept code-dependent tick and label providers and therefore remain code-only. */
export const gridRulerMeta = {
  name: 'GridRuler',
  category: 'foundation',
  description: 'Projects visible world-axis ticks into a passive horizontal or vertical ruler.',
  directManifestNode: false,
  note: GRID_RULERS_NOTE,
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
