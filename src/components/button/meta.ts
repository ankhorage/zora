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
      authoring: { authority: 'instance' },
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
      default: 'primary',
      authoring: { authority: 'theme', scope: 'component' },
    },
    variant: {
      type: 'enum',
      category: 'Style',
      label: 'Variant',
      enum: ['solid', 'outline', 'ghost', 'soft'],
      default: 'solid',
      authoring: { authority: 'theme', scope: 'component' },
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'm',
      authoring: { authority: 'theme', scope: 'component' },
    },
  },
} as const satisfies ZoraComponentMeta;
