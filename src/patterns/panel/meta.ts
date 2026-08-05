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
      authoring: { authority: 'instance' },
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      authoring: { authority: 'instance' },
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
      authoring: { authority: 'instance' },
    },
    tone: {
      type: 'enum',
      category: 'Style',
      label: 'Tone',
      enum: ['default', 'subtle', 'outline'],
      default: 'default',
      authoring: { authority: 'theme', scope: 'pattern' },
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
      authoring: { authority: 'theme', scope: 'pattern' },
    },
  },
} as const satisfies ZoraComponentMeta;
