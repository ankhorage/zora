import { COMPONENT_THEME_AUTHORING } from '../../constants';
import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const cardMeta = {
  name: 'Card',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: { label: 'Card', defaultProps: { title: 'Card' } },
  events: { press: { label: 'Press', eventType: 'card.press', payloadFields: [] } },
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
      authoring: COMPONENT_THEME_AUTHORING,
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      authoring: COMPONENT_THEME_AUTHORING,
    },
    padding: {
      type: 'spacing',
      category: 'Layout',
      label: 'Padding',
      authoring: COMPONENT_THEME_AUTHORING,
    },
    radius: {
      type: 'radius',
      category: 'Style',
      label: 'Corner radius',
      authoring: COMPONENT_THEME_AUTHORING,
    },
  },
} as const satisfies ZoraComponentMeta;
