import type { ZoraComponentMeta } from '../../metadata/types';

export const avatarMeta = {
  name: 'Avatar',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  props: {
    source: {
      type: 'media',
      category: 'Content',
      mediaKinds: ['image'],
    },
    name: {
      type: 'string',
      category: 'Content',
    },
    initials: {
      type: 'string',
      category: 'Content',
    },
    label: {
      type: 'string',
      category: 'Accessibility',
    },
    size: {
      type: 'enum',
      category: 'Style',
      enum: ['xs', 's', 'm', 'l', 'xl'],
    },
    shape: {
      type: 'enum',
      category: 'Style',
      enum: ['circle', 'rounded'],
    },
    color: {
      type: 'enum',
      category: 'Style',
      enum: ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
} as const satisfies ZoraComponentMeta;
