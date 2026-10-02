import type { ZoraComponentMeta } from '../../types/authoring';

export const toastProviderMeta = {
  name: 'ToastProvider',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Provider for imperative toast feedback; application roots should normally enable the ZoraProvider toast capability.',
  props: {},
} as const satisfies ZoraComponentMeta;
