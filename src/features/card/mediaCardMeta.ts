import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';

export const mediaCardMeta = {
  name: 'MediaCard',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  events: {
    press: {
      label: 'Press',
      eventType: 'mediaCard.press',
      payloadFields: [],
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
    },
    description: {
      type: 'string',
      category: 'Content',
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
    },
    imageSource: {
      type: 'media',
      category: 'Content',
      mediaKinds: ['image'],
    },
    imageLabel: {
      type: 'string',
      category: 'Accessibility',
    },
    imageAspectRatio: {
      type: 'number',
      category: 'Layout',
    },
    tone: {
      type: 'enum',
      category: 'Style',
      enum: ['default', 'subtle', 'outline'],
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
    },
  },
} as const satisfies ZoraComponentMeta;
