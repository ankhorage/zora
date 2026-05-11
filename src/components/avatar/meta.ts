import type { ZoraComponentMeta } from '../../metadata';

export const avatarMeta = {
  name: 'Avatar',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Identity component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
