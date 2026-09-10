import type { ZoraComponentMeta } from '../../metadata/types';
import { flatListMeta } from './flatListMeta';

export const sectionListMeta = {
  ...flatListMeta,
  name: 'SectionList',
  blueprint: { label: 'Section list', defaultProps: { sections: [] } },
  description:
    'Virtualized sections of ordered children. Section counts must cover every child exactly once.',
  events: {
    visibleItemsChange: {
      ...flatListMeta.events.visibleItemsChange,
      eventType: 'sectionList.visibleItemsChange',
    },
    refresh: { ...flatListMeta.events.refresh, eventType: 'sectionList.refresh' },
    endReached: { ...flatListMeta.events.endReached, eventType: 'sectionList.endReached' },
  },
  props: {
    ...flatListMeta.props,
    sections: {
      type: 'array',
      category: 'Data',
      itemSchema: [
        { key: 'key', schema: { type: 'string', category: 'Identity' } },
        { key: 'title', schema: { type: 'string', category: 'Content' } },
        { key: 'itemCount', schema: { type: 'number', category: 'Data' } },
      ],
    },
    stickySectionHeadersEnabled: { type: 'boolean', category: 'Behavior' },
  },
} as const satisfies ZoraComponentMeta;
