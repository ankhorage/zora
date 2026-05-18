import type { ZoraComponentMeta } from '../../metadata';

export const paginationMeta = {
  name: 'Pagination',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing controlled pagination component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
