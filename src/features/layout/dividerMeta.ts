import type { ZoraComponentMeta } from '../../metadata/types';
import { LAYOUT_PROPS } from './constants';

export const dividerMeta = {
  name: 'Divider',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [],
  props: {
    ...Object.fromEntries(
      Object.entries(LAYOUT_PROPS).filter(([key]) => key !== 'width' && key !== 'height'),
    ),
    orientation: { type: 'enum', category: 'Layout', enum: ['horizontal', 'vertical'] },
    color: { type: 'color', category: 'Style' },
    thickness: { type: 'number', category: 'Layout' },
  },
} as const satisfies ZoraComponentMeta;
