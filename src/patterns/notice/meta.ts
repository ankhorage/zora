import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const noticeMeta = {
  name: 'Notice',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Notice',
    defaultProps: {
      title: 'Notice',
      tone: 'primary',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Notice',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
    },
    tone: {
      type: 'enum',
      category: 'Style',
      label: 'Tone',
      enum: ['primary', 'neutral', 'danger', 'success', 'warning'],
      default: 'primary',
    },
  },
} as const satisfies ZoraComponentMeta;
