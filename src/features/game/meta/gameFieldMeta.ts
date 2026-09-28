import type { ZoraComponentMeta } from '../../../types/authoring';

/*** Describe the embeddable game field for ZORA authoring tools. */
export const gameFieldMeta = {
  name: 'GameField',
  category: 'layout',
  description: 'Relative positioning surface for embeddable game presentation content.',
  directManifestNode: true,
  allowedChildren: ['GameEntity', 'GameOverlay', 'Gradient', 'Image', 'View'],
  blueprint: {
    label: 'Game field',
    defaultProps: { minHeight: 320, clip: true },
  },
  props: {
    aspectRatio: {
      type: 'number',
      category: 'Layout',
      label: 'Aspect ratio',
      authoring: { authority: 'instance' },
    },
    minHeight: {
      type: 'number',
      category: 'Layout',
      label: 'Minimum height',
      default: 320,
      authoring: { authority: 'instance' },
    },
    fill: {
      type: 'boolean',
      category: 'Layout',
      label: 'Fill available space',
      default: false,
      authoring: { authority: 'instance' },
    },
    clip: {
      type: 'boolean',
      category: 'Layout',
      label: 'Clip overflow',
      default: true,
      authoring: { authority: 'instance' },
    },
    accessibilityLabel: {
      type: 'string',
      category: 'Accessibility',
      label: 'Accessibility label',
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
