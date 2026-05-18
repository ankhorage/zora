import type { ZoraComponentMeta } from '../../metadata';

export const breadcrumbsMeta = {
  name: 'Breadcrumbs',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Code-facing route hierarchy component; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
