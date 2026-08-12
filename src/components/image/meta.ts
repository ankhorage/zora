import type { ZoraComponentMeta } from '../../metadata';

export const imageMeta = {
  name: 'Image',
  category: 'component',
  description: 'Displays an image from the app media registry or a resolved runtime source.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Image' },
  props: {
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
