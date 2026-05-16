import type { ZoraComponentMeta } from '../../metadata';

const LIST_NOTE = 'List pattern component; not represented as a manifest node in v1.';

export const listMeta = {
  name: 'List',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const listRowMeta = {
  name: 'ListRow',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  events: {
    itemPress: {
      label: 'Item press',
      eventType: 'collection.itemPress',
      description: 'Emitted when a collection item row is selected.',
      payloadFields: [
        {
          path: 'payload.itemId',
          type: 'string',
          label: 'Item ID',
        },
        {
          path: 'payload.item',
          type: 'record',
          label: 'Item',
        },
      ],
    },
  },
  props: {},
} as const satisfies ZoraComponentMeta;

export const listSectionMeta = {
  name: 'ListSection',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
