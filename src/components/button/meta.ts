import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

const themeAuthoring = {
  authority: 'theme',
  scope: 'component',
  allowInstanceOverride: true,
} as const;

export const buttonMeta = {
  name: 'Button',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Button', defaultProps: { children: 'Continue' } },
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
      authoring: themeAuthoring,
    },
    variant: {
      type: 'enum',
      category: 'Style',
      label: 'Variant',
      enum: ['solid', 'outline', 'ghost', 'soft'],
      authoring: themeAuthoring,
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      authoring: themeAuthoring,
    },
  },
} as const satisfies ZoraComponentMeta;
