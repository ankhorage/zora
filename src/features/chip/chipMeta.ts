import type { ZoraComponentMeta } from '../../metadata/types';

export const chipMeta = {
  name: 'Chip',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  events: {
    press: {
      label: 'Press',
      eventType: 'chip.press',
      payloadFields: [],
    },
  },
  props: {
    children: {
      type: 'string',
      category: 'Content',
    },
    selected: {
      type: 'boolean',
      category: 'State',
    },
    disabled: {
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
  },
} as const satisfies ZoraComponentMeta;
