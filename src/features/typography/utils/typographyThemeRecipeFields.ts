import { ZORA_COLORS, ZORA_EMPHASES } from '../../theme/colorModel';

/*** Defines the common presentation fields used by Typography theme recipes. */
export const typographyThemeRecipeFields = {
  color: { type: 'choice', label: 'Color', options: ZORA_COLORS },
  emphasis: {
    type: 'choice',
    label: 'Emphasis',
    options: ZORA_EMPHASES,
    default: 'default',
  },
  align: {
    type: 'choice',
    label: 'Align',
    options: ['auto', 'left', 'right', 'center', 'justify'],
  },
  weight: {
    type: 'choice',
    label: 'Weight',
    options: ['regular', 'medium', 'semiBold', 'bold'],
  },
  italic: { type: 'boolean', label: 'Italic', default: false },
} as const;
