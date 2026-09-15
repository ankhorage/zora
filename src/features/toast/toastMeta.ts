import type { ZoraComponentMeta } from '../authoring';

export const toastMeta = {
  name: 'Toast',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Transient feedback component exposed through the imperative toast workflow, not as a manifest node.',
  props: {},
} as const satisfies ZoraComponentMeta;
