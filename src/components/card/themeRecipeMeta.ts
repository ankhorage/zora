import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const cardThemeRecipeMeta = {
  name: 'Card',
  kind: 'component',
  description: 'Maps global rhythm and surface tokens into Card presentation.',
  fields: {
    tone: {
      type: 'choice',
      label: 'Tone',
      options: ['default', 'subtle', 'outline'],
      default: 'default',
    },
    padding: {
      type: 'token',
      tokenFamily: 'spacing',
      label: 'Padding',
      description: 'When unset, Card keeps its compact-aware spacing default.',
    },
    radius: {
      type: 'token',
      tokenFamily: 'radii',
      label: 'Corner radius',
      default: 'l',
    },
    compact: {
      type: 'boolean',
      label: 'Compact',
      default: false,
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
