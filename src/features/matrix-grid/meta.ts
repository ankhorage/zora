import type { ZoraComponentMeta } from '../../types/authoring';

/** Code-only rendering and non-serializable cell callbacks stay outside manifest authoring. */
export const matrixGridMeta = {
  name: 'MatrixGrid',
  category: 'foundation',
  description: 'Virtualized sparse matrix renderer for executable code APIs.',
  directManifestNode: false,
  note: 'Requires a renderCell callback and is intentionally code-only.',
  allowedChildren: [],
  props: {},
} as const satisfies ZoraComponentMeta;
