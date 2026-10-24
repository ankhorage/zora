import { CONTAINER_ALLOWED_CHILDREN } from '../../constants/authoring';
import type { ZoraComponentMeta } from '../../types/authoring';
import { LAYOUT_PROPS } from './constants';

export const scrollViewMeta = {
  name: 'ScrollView',
  category: 'foundation',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  events: {
    refresh: {
      label: 'Refresh',
      eventType: 'scrollView.refresh',
      description: 'Emitted when the native refresh control requests fresh content.',
      payloadFields: [],
    },
  },
  props: {
    ...LAYOUT_PROPS,
    horizontal: { type: 'boolean', category: 'Layout', default: false },
    refreshing: { type: 'boolean', category: 'State', default: false },
  },
} as const satisfies ZoraComponentMeta;
