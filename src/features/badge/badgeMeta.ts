import type { ZoraComponentMeta } from '../../metadata/types';

export const badgeMeta = {
  name: 'Badge',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  props: {
    children: {
      type: 'string',
      category: 'Content',
    },
    color: {
      type: 'enum',
      category: 'Style',
      enum: ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    variant: {
      type: 'enum',
      category: 'Style',
      enum: ['solid', 'soft', 'outline'],
    },
    size: {
      type: 'enum',
      category: 'Style',
      enum: ['s', 'm', 'l'],
    },
  },
} as const satisfies ZoraComponentMeta;
