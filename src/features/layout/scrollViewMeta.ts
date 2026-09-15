import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';
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
