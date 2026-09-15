import type { ZoraComponentMeta } from '../authoring';

export const breadcrumbsMeta = {
  name: 'Breadcrumbs',
  category: 'component',
  description: 'Hierarchical route context where the final item represents the current location.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Breadcrumbs',
    defaultProps: {
      items: [
        { id: 'settings', label: 'Settings' },
        { id: 'general', label: 'General' },
      ],
      separator: '/',
      compact: false,
      disabled: false,
    },
  },
  bindings: {
    events: {
      itemPress: {
        label: 'Item press',
        description: 'Runs when a non-current breadcrumb item is pressed.',
        payload: {
          eventType: 'breadcrumbs.itemPress',
          fields: [{ path: 'id', type: 'string', label: 'Item id' }],
        },
      },
    },
  },
  events: {
    itemPress: {
      label: 'Item press',
      eventType: 'breadcrumbs.itemPress',
      description: 'Emitted when a non-current breadcrumb item is pressed.',
      payloadFields: [{ path: 'id', type: 'string', label: 'Item id' }],
    },
  },
  props: {
    items: {
      type: 'array',
      category: 'Content',
      label: 'Items',
      itemSchema: [
        {
          key: 'id',
          schema: { type: 'string', category: 'Content', label: 'Id' },
        },
        {
          key: 'label',
          schema: { type: 'string', category: 'Content', label: 'Label' },
        },
        {
          key: 'disabled',
          schema: {
            type: 'boolean',
            category: 'State',
            label: 'Disabled',
            default: false,
          },
        },
      ],
      authoring: { authority: 'instance' },
    },
    separator: {
      type: 'string',
      category: 'Content',
      label: 'Separator',
      default: '/',
      authoring: { authority: 'instance' },
    },
    maxItems: {
      type: 'number',
      category: 'Layout',
      label: 'Maximum items',
      authoring: { authority: 'instance' },
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
      authoring: { authority: 'instance' },
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
      authoring: { authority: 'instance' },
    },
  },
} as const satisfies ZoraComponentMeta;
