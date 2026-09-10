import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';
import { LAYOUT_PROPS } from './constants';

export const boxMeta = {
  name: 'Box',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    bg: { type: 'color', category: 'Style' },
    borderColor: { type: 'color', category: 'Style' },
    borderWidth: { type: 'number', category: 'Style' },
  },
} as const satisfies ZoraComponentMeta;
