import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';

export const splashScreenMeta = {
  name: 'SplashScreen',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description: 'App content splash presentation; does not control the native launch screen.',
  props: {
    title: {
      type: 'string',
      category: 'Content',
    },
    subtitle: {
      type: 'string',
      category: 'Content',
    },
    minHeight: {
      type: 'number',
      category: 'Layout',
    },
    backgroundColor: {
      type: 'color',
      category: 'Style',
    },
    logoSize: {
      type: 'number',
      category: 'Layout',
    },
    logoLabel: {
      type: 'string',
      category: 'Accessibility',
    },
    logoShape: {
      type: 'enum',
      category: 'Style',
      enum: ['circle', 'square', 'rounded'],
    },
  },
} as const satisfies ZoraComponentMeta;
