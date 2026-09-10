import type { ZoraComponentMeta } from '../../metadata';

export const iconMeta = {
  name: 'Icon',
  category: 'component',
  description: 'Displays a standalone SVG icon from the app media registry.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Icon' },
  props: {
    source: {
      type: 'media',
      category: 'Content',
      label: 'SVG source',
      mediaKinds: ['image'],
      authoring: { authority: 'instance' },
    },
    size: {
      type: 'number',
      category: 'Appearance',
      label: 'Size',
      authoring: { authority: 'instance' },
    },
    color: {
      type: 'string',
      category: 'Appearance',
      label: 'Color',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
