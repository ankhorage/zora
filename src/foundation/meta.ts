import type { ZoraComponentMetaRegistry } from '../metadata';

export const foundationMetas = {
  Center: {
    name: 'Center',
    category: 'foundation',
    directManifestNode: false,
    allowedChildren: [],
    note: 'Layout helper component; not represented as a manifest node in v1.',
    props: {},
  },
  Inline: {
    name: 'Inline',
    category: 'foundation',
    directManifestNode: false,
    allowedChildren: [],
    note: 'Layout helper component; not represented as a manifest node in v1.',
    props: {},
  },
  Show: {
    name: 'Show',
    category: 'foundation',
    directManifestNode: false,
    allowedChildren: [],
    note: 'Responsive utility component; not represented as a manifest node in v1.',
    props: {},
  },
  Spacer: {
    name: 'Spacer',
    category: 'foundation',
    directManifestNode: false,
    allowedChildren: [],
    note: 'Spacing utility component; not represented as a manifest node in v1.',
    props: {},
  },
} as const satisfies ZoraComponentMetaRegistry;
