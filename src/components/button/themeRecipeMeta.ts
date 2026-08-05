import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const buttonThemeRecipeMeta = {
  name: 'Button',
  kind: 'component',
  description: 'Maps shared theme tokens and semantic choices into Button presentation.',
  fields: {
    color: {
      type: 'token',
      tokenFamily: 'colors',
      label: 'Color',
      default: 'primary',
    },
    variant: {
      type: 'choice',
      label: 'Variant',
      options: ['solid', 'outline', 'ghost', 'soft'],
      default: 'solid',
    },
    size: {
      type: 'choice',
      label: 'Size',
      description: 'A Button-specific semantic scale, not a universal pixel size.',
      options: ['s', 'm', 'l'],
      default: 'm',
    },
    radius: {
      type: 'token',
      tokenFamily: 'radii',
      label: 'Corner radius',
      default: 'm',
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
