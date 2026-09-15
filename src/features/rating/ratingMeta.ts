import type { ZoraComponentMeta } from '../../types/authoring';

export const ratingMeta = {
  name: 'Rating',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  description: 'Displays a read-only star-based rating value.',
  blueprint: { label: 'Rating', defaultProps: { color: 'warning', max: 5, size: 'm', value: 4.5 } },
  bindings: {
    props: {
      value: {
        label: 'Value',
        description: 'Current rating value.',
        value: { type: 'number' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    value: { type: 'number', category: 'Data', label: 'Value' },
    max: { type: 'number', category: 'Data', label: 'Maximum', default: 5 },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [
        'neutral',
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'success',
        'warning',
        'danger',
        'error',
        'info',
      ],
      default: 'warning',
    },
    size: { type: 'enum', category: 'Style', label: 'Size', enum: ['s', 'm', 'l'], default: 'm' },
  },
} as const satisfies ZoraComponentMeta;
