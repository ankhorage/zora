import { ZORA_COLORS } from '../../../internal/colorModel';
import type { ZoraThemeRecipeMeta } from '../../../metadata/themeRecipeTypes';

export const radioGroupThemeRecipeMeta = {
  name: 'RadioGroup',
  kind: 'component',
  description: 'Maps shared selection-control presentation choices into RadioGroup defaults.',
  fields: {
    gap: {
      type: 'choice',
      label: 'Gap',
      options: ['xs', 's', 'm', 'l'],
      default: 's',
    },
    color: {
      type: 'choice',
      label: 'Color',
      options: ZORA_COLORS,
      default: 'primary',
    },
    size: {
      type: 'choice',
      label: 'Size',
      options: ['s', 'm', 'l'],
      default: 'm',
    },
  },
} as const satisfies ZoraThemeRecipeMeta;
