import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';
import { LAYOUT_PROPS } from './constants';

export const containerMeta = {
  name: 'Container',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: Object.fromEntries(Object.entries(LAYOUT_PROPS).filter(([key]) => key !== 'width')),
} as const satisfies ZoraComponentMeta;
