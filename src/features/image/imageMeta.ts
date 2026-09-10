import type { ZoraComponentMeta } from '../../metadata';

export const imageMeta = {
  name: 'Image',
  category: 'component',
  description: 'Displays an image from the app media registry or a resolved runtime source.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Image' },
  props: {
    fit: {
      type: 'enum',
      category: 'Layout',
      enum: ['cover', 'contain', 'stretch', 'repeat', 'center', 'none'],
    },
    aspectRatio: { type: 'number', category: 'Layout' },
    width: { type: 'number', category: 'Layout' },
    height: { type: 'number', category: 'Layout' },
    radius: { type: 'radius', category: 'Style' },
    fallbackSource: { type: 'media', category: 'Content', mediaKinds: ['image'] },
    source: {
      type: 'media',
      category: 'Content',
      label: 'Source',
      mediaKinds: ['image'],
      authoring: { authority: 'instance' },
    },
    alt: {
      type: 'string',
      category: 'Accessibility',
      label: 'Alt text',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
