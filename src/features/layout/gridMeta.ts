import type { ZoraComponentMeta } from '../../types/authoring';
import {
  CHESS_ALLOWED_CHILDREN,
  CONTAINER_ALLOWED_CHILDREN,
  GAME_ALLOWED_CHILDREN,
  TABLETOP_ALLOWED_CHILDREN,
} from '../../constants/authoring';
import { LAYOUT_PROPS } from './constants';

export const gridMeta = {
  name: 'Grid',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [
    ...CONTAINER_ALLOWED_CHILDREN,
    ...CHESS_ALLOWED_CHILDREN,
    ...GAME_ALLOWED_CHILDREN,
    ...TABLETOP_ALLOWED_CHILDREN,
  ],
  props: {
    ...LAYOUT_PROPS,
    cols: { type: 'number', category: 'Layout', default: 1 },
    gap: { type: 'spacing', category: 'Spacing' },
    rowGap: { type: 'spacing', category: 'Spacing' },
    colGap: { type: 'spacing', category: 'Spacing' },
    minItemWidth: { type: 'number', category: 'Layout' },
  },
} as const satisfies ZoraComponentMeta;
