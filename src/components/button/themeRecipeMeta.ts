import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const buttonThemeRecipeMeta = {
  name: 'Button',
  kind: 'component',
  description: 'Maps shared semantic choices into Button presentation defaults.',
  fields: {
    color: {
      type: 'choice',
      label: 'Color',
      options: ZORA_COLORS,
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
      default: 'l',
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
