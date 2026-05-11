import type { ZoraComponentMeta } from '../../metadata';

export const progressMeta = {
  name: 'Progress',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Feedback component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
