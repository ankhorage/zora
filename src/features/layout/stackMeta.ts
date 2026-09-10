import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';
import { LAYOUT_PROPS } from './constants';

export const stackMeta = {
  name: 'Stack',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    direction: { type: 'enum', category: 'Layout', enum: ['row', 'column'] },
    gap: { type: 'spacing', category: 'Spacing' },
    align: {
      type: 'enum',
      category: 'Layout',
      enum: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justify: {
      type: 'enum',
      category: 'Layout',
      enum: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    wrap: { type: 'enum', category: 'Layout', enum: ['nowrap', 'wrap'] },
  },
} as const satisfies ZoraComponentMeta;
