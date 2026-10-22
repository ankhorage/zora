import type { ZoraThemeRecipeMeta } from '../../../types/theme-recipe';
import { typographyThemeRecipeFields } from './typographyThemeRecipeFields';

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
    ...typographyThemeRecipeFields,
  },
} as const satisfies ZoraThemeRecipeMeta;
