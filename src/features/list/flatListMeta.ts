import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';

export const flatListMeta = {
  name: 'FlatList',
  category: 'layout',
  directManifestNode: true,
  blueprint: { label: 'Flat list' },
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description:
    'Virtualized children. Put node.repeat on this list for keyed data and item bindings; bind selection on the child Button/Card press event. Bound the list viewport and avoid nesting in a same-direction ScrollView.',
  events: {
    visibleItemsChange: {
      label: 'Visible items change',
      eventType: 'flatList.visibleItemsChange',
      payloadFields: [{ path: 'keys', type: 'unknown' }],
    },
    refresh: { label: 'Refresh', eventType: 'flatList.refresh', payloadFields: [] },
    endReached: {
      label: 'End reached',
      eventType: 'flatList.endReached',
      payloadFields: [{ path: 'distanceFromEnd', type: 'number' }],
    },
  },
  props: {
    horizontal: { type: 'boolean', category: 'Layout' },
    refreshing: { type: 'boolean', category: 'State' },
    initialNumToRender: { type: 'number', category: 'Virtualization' },
    maxToRenderPerBatch: { type: 'number', category: 'Virtualization' },
    windowSize: { type: 'number', category: 'Virtualization' },
    onEndReachedThreshold: { type: 'number', category: 'Behavior' },
    showsScrollIndicator: { type: 'boolean', category: 'Style' },
    bounces: { type: 'boolean', category: 'Behavior' },
    showSeparators: { type: 'boolean', category: 'Style' },
    headerText: { type: 'string', category: 'Content' },
    footerText: { type: 'string', category: 'Content' },
    emptyText: { type: 'string', category: 'Content' },
  },
} as const satisfies ZoraComponentMeta;
