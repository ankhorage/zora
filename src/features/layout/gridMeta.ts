import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';
import { LAYOUT_PROPS } from './constants';

export const gridMeta = {
  name: 'Grid',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    cols: { type: 'number', category: 'Layout', default: 1 },
    gap: { type: 'spacing', category: 'Spacing' },
    rowGap: { type: 'spacing', category: 'Spacing' },
    colGap: { type: 'spacing', category: 'Spacing' },
    minItemWidth: { type: 'number', category: 'Layout' },
  },
} as const satisfies ZoraComponentMeta;
