import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';
import { LAYOUT_PROPS } from '../layout/constants';

export const surfaceMeta = {
  name: 'Surface',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    variant: { type: 'enum', category: 'Style', enum: ['default', 'subtle', 'raised', 'outline'] },
  },
} as const satisfies ZoraComponentMeta;
