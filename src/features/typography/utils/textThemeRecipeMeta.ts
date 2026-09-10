import { ZORA_COLORS, ZORA_EMPHASES } from '../../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../../metadata/themeRecipeTypes';

export const textThemeRecipeMeta = {
  name: 'Text',
  kind: 'component',
  description: 'Maps semantic Text presentation defaults into runtime props.',
  fields: {
    variant: {
      type: 'choice',
      label: 'Typography variant',
      options: ['body', 'lead', 'bodySmall', 'caption', 'label', 'eyebrow', 'code'],
      default: 'body',
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
