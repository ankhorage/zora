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
      tone: 'primary',
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
    tone: {
      type: 'enum',
      category: 'Style',
      label: 'Tone',
      enum: ['primary', 'neutral', 'danger', 'success', 'warning'],
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
