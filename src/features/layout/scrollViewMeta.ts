import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';
import { LAYOUT_PROPS } from './constants';

export const scrollViewMeta = {
  name: 'ScrollView',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    horizontal: { type: 'boolean', category: 'Layout', default: false },
  },
} as const satisfies ZoraComponentMeta;
