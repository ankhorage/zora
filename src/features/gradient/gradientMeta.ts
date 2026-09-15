import type { ZoraComponentMeta } from '../authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

export const gradientMeta = {
  name: 'Gradient',
  category: 'component',
  description: 'Renders a host-backed gradient container for nested manifest content.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Gradient',
  },
  props: {
    colors: {
      type: 'array',
      category: 'Style',
      label: 'Colors',
    },
    locations: { type: 'array', category: 'Style', label: 'Locations' },
    width: { type: 'number', category: 'Layout', label: 'Width' },
    height: { type: 'number', category: 'Layout', label: 'Height' },
    minHeight: { type: 'number', category: 'Layout', label: 'Minimum height' },
    radius: { type: 'radius', category: 'Style', label: 'Corner radius' },
    p: { type: 'spacing', category: 'Layout', label: 'Padding' },
  },
} as const satisfies ZoraComponentMeta;
