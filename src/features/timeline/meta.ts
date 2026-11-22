import type { ZoraComponentMeta } from '../../types/authoring';

import { ZORA_COLORS } from '../theme/colorModel';

export const timelineMeta = {
  name: 'Timeline',
  category: 'pattern',
  description: 'Displays an ordered sequence of dated events with accessible image markers.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Timeline', defaultProps: { items: [] } },
  props: {
    items: {
      type: 'array',
      category: 'Content',
      label: 'Events',
      itemSchema: [
        { key: 'id', schema: { type: 'string', category: 'Identity', label: 'Event ID' } },
        { key: 'title', schema: { type: 'string', category: 'Content', label: 'Title' } },
        {
          key: 'description',
          schema: { type: 'string', category: 'Content', label: 'Description' },
        },
        { key: 'meta', schema: { type: 'string', category: 'Content', label: 'Date and time' } },
        {
          key: 'status',
          schema: {
            type: 'enum',
            category: 'State',
            label: 'Status',
            enum: ZORA_COLORS,
          },
        },
        {
          key: 'marker',
          schema: {
            type: 'media',
            category: 'Content',
            label: 'SVG or image marker',
            mediaKinds: ['image'],
          },
        },
        {
          key: 'markerAlt',
          schema: { type: 'string', category: 'Accessibility', label: 'Marker alternative text' },
        },
      ],
      authoring: { authority: 'instance' },
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
