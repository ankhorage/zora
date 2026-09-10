import type { ZoraComponentMeta } from '../../metadata/types';

export const metricCardMeta = {
  name: 'MetricCard',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  events: {
    press: {
      label: 'Press',
      eventType: 'metricCard.press',
      payloadFields: [],
    },
  },
  props: {
    label: {
      type: 'string',
      category: 'Content',
    },
    value: {
      type: 'string',
      category: 'Content',
    },
    description: {
      type: 'string',
      category: 'Content',
    },
    delta: {
      type: 'string',
      category: 'Content',
    },
    deltaColor: {
      type: 'enum',
      category: 'Style',
      enum: ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
    tone: {
      type: 'enum',
      category: 'Style',
      enum: ['default', 'subtle', 'outline'],
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
    },
  },
} as const satisfies ZoraComponentMeta;
