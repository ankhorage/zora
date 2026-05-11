import type { ZoraComponentMeta } from '../../metadata';

export const mediaCardMeta = {
  name: 'MediaCard',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Specialized component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
