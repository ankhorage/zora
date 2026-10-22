import type { ZoraThemeRecipeMeta } from '../../../types/theme-recipe';
import { typographyThemeRecipeFields } from './typographyThemeRecipeFields';

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
    ...typographyThemeRecipeFields,
  },
} as const satisfies ZoraThemeRecipeMeta;
