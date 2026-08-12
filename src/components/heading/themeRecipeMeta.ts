import { ZORA_COLORS, ZORA_EMPHASES } from '../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const headingThemeRecipeMeta = {
  name: 'Heading',
  kind: 'component',
  description: 'Maps Heading presentation defaults without replacing semantic heading levels.',
  fields: {
    size: {
      type: 'choice',
      label: 'Size',
      options: ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
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
  },
} as const satisfies ZoraThemeRecipeMeta;
