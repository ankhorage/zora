import { ZORA_COLORS } from '../../internal/colorModel';
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
      variant: 'solid',
      size: 'm',
    },
  },
  events: {
    press: {
      label: 'Press',
      eventType: 'button.press',
      description: 'Emitted when the button action runs.',
      payloadFields: [],
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
      enum: [...ZORA_COLORS],
      default: 'primary',
    },
    variant: {
      type: 'enum',
      category: 'Style',
      label: 'Variant',
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
