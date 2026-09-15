import type { ZoraThemeRecipeMeta } from '../../../types/theme-recipe';
import { ZORA_COLORS } from '../../theme/colorModel';

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
