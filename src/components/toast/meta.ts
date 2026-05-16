import type { ZoraComponentMeta } from '../../metadata';

export const toastMeta = {
  name: 'Toast',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Transient feedback component; exposed as an imperative provider/hook workflow, not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;

export const toastProviderMeta = {
  name: 'ToastProvider',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Provider for imperative toast feedback; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
