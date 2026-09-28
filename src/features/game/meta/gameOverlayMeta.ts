import type { ZoraComponentMeta } from '../../../types/authoring';

/*** Describe a generic absolute game layer for HUD, feedback, and phase content. */
export const gameOverlayMeta = {
  name: 'GameOverlay',
  category: 'layout',
  description: 'Absolute presentation layer for HUD, feedback, controls, and phase content.',
  directManifestNode: true,
  allowedChildren: [
    'Badge',
    'Button',
    'ButtonGroup',
    'Card',
    'GameEntity',
    'Heading',
    'Icon',
    'Image',
    'Progress',
    'ProgressRing',
    'Text',
    'View',
  ],
  blueprint: {
    label: 'Game overlay',
    defaultProps: { placement: 'fill', blocking: false, padding: 0 },
  },
  props: {
    placement: {
      type: 'enum',
      category: 'Layout',
      label: 'Placement',
      enum: [
        'fill',
        'center',
        'top',
        'bottom',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      default: 'fill',
      authoring: { authority: 'instance' },
    },
    blocking: {
      type: 'boolean',
      category: 'Interaction',
      label: 'Block pointer input',
      default: false,
      authoring: { authority: 'instance' },
    },
    padding: {
      type: 'number',
      category: 'Layout',
      label: 'Padding',
      default: 0,
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
