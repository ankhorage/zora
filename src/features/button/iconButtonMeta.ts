import type { ZoraComponentMeta } from '../../metadata/types';

export const iconButtonMeta = {
  name: 'IconButton',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  events: {
    press: {
      label: 'Press',
      eventType: 'iconButton.press',
      payloadFields: [],
    },
  },
  props: {
    iconName: {
      type: 'string',
      category: 'Content',
    },
    label: {
      type: 'string',
      category: 'Accessibility',
    },
    disabled: {
      type: 'boolean',
      category: 'State',
    },
    loading: {
      type: 'boolean',
      category: 'State',
    },
    color: {
      type: 'enum',
      category: 'Style',
      enum: ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    size: {
      type: 'enum',
      category: 'Style',
      enum: ['s', 'm', 'l'],
    },
    variant: {
      type: 'enum',
      category: 'Style',
      enum: ['solid', 'outline', 'ghost', 'soft'],
    },
  },
} as const satisfies ZoraComponentMeta;
