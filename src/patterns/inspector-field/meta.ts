import type { ZoraComponentMeta } from '../../metadata';

export const inspectorFieldMeta = {
  name: 'InspectorField',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Inspector pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
