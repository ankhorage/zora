import type { ZoraComponentMeta } from '../../metadata';

export const buttonMeta = {
  name: 'Button',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Button',
    defaultProps: {
      children: 'Continue',
      color: 'primary',
      emphasis: 'solid',
      size: 'm',
    },
  },
  props: {
    children: {
      type: 'string',
      category: 'Content',
      label: 'Label',
      default: 'Continue',
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'neutral',
        'success',
        'warning',
        'error',
        'info',
        'danger',
      ],
      default: 'primary',
    },
    emphasis: {
      type: 'enum',
      category: 'Style',
      label: 'Emphasis',
      enum: ['solid', 'outline', 'ghost', 'soft'],
      default: 'solid',
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'm',
    },
  },
} as const satisfies ZoraComponentMeta;
