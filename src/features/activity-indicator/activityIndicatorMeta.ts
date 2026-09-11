import type { ZoraComponentMeta } from '../../metadata';

export const activityIndicatorMeta = {
  name: 'ActivityIndicator',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Activity indicator', defaultProps: { size: 'small' } },
  props: {
    size: { type: 'enum', category: 'Style', label: 'Size', enum: ['small', 'large'] },
    color: { type: 'color', category: 'Style', label: 'Color' },
    animating: { type: 'boolean', category: 'State', label: 'Animating', default: true },
  },
} as const satisfies ZoraComponentMeta;
