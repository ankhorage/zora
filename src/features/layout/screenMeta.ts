import type { ZoraComponentMeta } from '../authoring';
import { SCREEN_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

export const screenMeta = {
  name: 'Screen',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...SCREEN_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Screen',
  },
  props: {
    width: {
      type: 'enum',
      category: 'Layout',
      label: 'Width',
      enum: ['narrow', 'default', 'wide'],
      default: 'default',
    },
    scroll: {
      type: 'boolean',
      category: 'Layout',
      label: 'Scroll',
      default: true,
    },
  },
} as const satisfies ZoraComponentMeta;
