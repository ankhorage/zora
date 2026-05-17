import type { ZoraComponentMeta } from '../../metadata';

export const dataTableMeta = {
  name: 'DataTable',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing typed data table component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
