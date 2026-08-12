import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

const themeAuthoring = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const cardMeta = {
  name: 'Card',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: { label: 'Card', defaultProps: { title: 'Card' } },
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
      authoring: themeAuthoring,
    },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', authoring: themeAuthoring },
    padding: { type: 'spacing', category: 'Layout', label: 'Padding', authoring: themeAuthoring },
    radius: {
      type: 'radius',
      category: 'Style',
      label: 'Corner radius',
      authoring: themeAuthoring,
    },
  },
} as const satisfies ZoraComponentMeta;
