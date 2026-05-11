import type { ZoraComponentMeta } from '../../metadata';
import { PAGE_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const pageMeta = {
  name: 'Page',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...PAGE_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Page',
  },
  props: {
    width: {
      type: 'enum',
      category: 'Layout',
      label: 'Width',
      enum: ['narrow', 'default', 'wide'],
      default: 'default',
    },
  },
} as const satisfies ZoraComponentMeta;
