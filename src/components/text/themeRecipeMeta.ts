import type { ZoraThemeRecipeMeta } from '../../metadata/themeRecipeTypes';

export const textThemeRecipeMeta = {
  name: 'Text',
  kind: 'component',
  description: 'Maps shared typography and color tokens into Text presentation.',
  fields: {
    variant: {
      type: 'token',
      tokenFamily: 'typography',
      label: 'Typography variant',
      default: 'body',
    },
    color: {
      type: 'token',
      tokenFamily: 'colors',
      label: 'Color',
      default: 'text',
    },
    emphasis: {
      type: 'choice',
      label: 'Emphasis',
      options: ['default', 'muted', 'subtle', 'inverse'],
      default: 'default',
    },
    weight: {
      type: 'choice',
      label: 'Weight',
      options: ['regular', 'medium', 'semiBold', 'bold'],
      default: 'regular',
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
