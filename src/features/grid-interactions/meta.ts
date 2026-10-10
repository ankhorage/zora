import type { ZoraComponentMeta } from '../../types/authoring';

/** Grid input is a code composition boundary because it accepts live geometry and callbacks. */
export const gridInteractionsMeta = {
  name: 'GridInteractions',
  category: 'foundation',
  description: 'Maps native and web input to controlled world-space grid interaction intents.',
  directManifestNode: false,
  note: 'Requires live viewport geometry, item data, and an executable intent callback; available through code APIs only.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
