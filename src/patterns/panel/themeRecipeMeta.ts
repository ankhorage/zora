import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const panelThemeRecipeMeta = {
  name: 'Panel',
  kind: 'pattern',
  description: 'Maps global rhythm and surface tokens into Panel presentation.',
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
      default: 'l',
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
