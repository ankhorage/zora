import type { ZoraComponentMeta } from '../../metadata';

export const uploaderMeta = {
  name: 'Uploader',
  category: 'pattern',
  description: 'Picks and manages one image, video, document, or generic file upload.',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Upload transport callbacks remain runtime-owned and are not serialized into AppManifest.',
  props: {},
} as const satisfies ZoraComponentMeta;
