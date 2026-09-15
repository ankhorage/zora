import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';
import { LAYOUT_PROPS } from './constants';

export const viewMeta = {
  name: 'View',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  props: {
    ...LAYOUT_PROPS,
    direction: { type: 'enum', category: 'Layout', enum: ['row', 'column'] },
    gap: { type: 'spacing', category: 'Spacing' },
    rowGap: { type: 'spacing', category: 'Spacing' },
    columnGap: { type: 'spacing', category: 'Spacing' },
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
    bg: { type: 'color', category: 'Style' },
    borderColor: { type: 'color', category: 'Style' },
    borderWidth: { type: 'number', category: 'Style' },
  },
} as const satisfies ZoraComponentMeta;
