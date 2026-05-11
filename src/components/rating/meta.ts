import type { ZoraComponentMeta } from '../../metadata';

export const ratingMeta = {
  name: 'Rating',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Feedback component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
