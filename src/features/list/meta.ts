import type { ZoraComponentMeta } from '../authoring';

const LIST_NOTE =
  'List feature component; collection authoring is represented through List metadata.';

export const listMeta = {
  name: 'List',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const listItemMeta = {
  name: 'ListItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  events: {
    itemPress: {
      label: 'Item press',
      eventType: 'collection.itemPress',
      description: 'Emitted when a collection item is selected.',
      payloadFields: [
        { path: 'payload.itemId', type: 'string', label: 'Item ID' },
        { path: 'payload.item', type: 'record', label: 'Item' },
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
