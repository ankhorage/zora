import type { ZoraComponentMeta } from '../authoring';

export const collectionEditorMeta = {
  name: 'CollectionEditor',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: 'Specialized editing pattern; not represented as a manifest node in v1.',
  props: {},
} as const satisfies ZoraComponentMeta;
