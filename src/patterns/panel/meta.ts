import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const panelMeta = {
  name: 'Panel',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Panel',
    defaultProps: {
      title: 'Panel',
      tone: 'default',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
    },
    tone: {
      type: 'enum',
      category: 'Style',
      label: 'Tone',
      enum: ['default', 'subtle', 'outline'],
      default: 'default',
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
