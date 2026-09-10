import type { ZoraComponentMeta } from '../../metadata';

export const productCardMeta = {
  name: 'ProductCard',
  category: 'pattern',
  description: 'A generic card for displaying product or article information.',
  directManifestNode: true,
  allowedChildren: [],
  events: {
    press: {
      label: 'Press',
      eventType: 'productCard.press',
      description: 'Emitted when the product card is pressed.',
      payloadFields: [],
    },
    primaryAction: {
      label: 'Primary action',
      eventType: 'productCard.primaryAction',
      description: 'Emitted when the primary product card action is pressed.',
      payloadFields: [],
    },
    secondaryAction: {
      label: 'Secondary action',
      eventType: 'productCard.secondaryAction',
      description: 'Emitted when the secondary product card action is pressed.',
      payloadFields: [],
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
    },
    subtitle: {
      type: 'string',
      category: 'Content',
      label: 'Subtitle',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
    },
    brand: {
      type: 'string',
      category: 'Content',
      label: 'Brand',
    },
    vendor: {
      type: 'string',
      category: 'Content',
      label: 'Vendor',
    },
    imageUrl: {
      type: 'string',
      category: 'Content',
      label: 'Image URL',
    },
    imageAlt: {
      type: 'string',
      category: 'Content',
      label: 'Image Alt Text',
    },
    price: {
      type: 'string',
      category: 'Content',
      label: 'Price',
    },
    currency: {
      type: 'string',
      category: 'Content',
      label: 'Currency',
    },
    badges: {
      type: 'array',
      category: 'Content',
      label: 'Badges',
    },
    meta: {
      type: 'array',
      category: 'Content',
      label: 'Meta',
    },
    primaryActionLabel: {
      type: 'string',
      category: 'Content',
      label: 'Primary Action Label',
    },
    secondaryActionLabel: {
      type: 'string',
      category: 'Content',
      label: 'Secondary Action Label',
    },
    onPress: {
      type: 'action',
      category: 'Events',
      label: 'Press action',
    },
    onPrimaryAction: {
      type: 'action',
      category: 'Events',
      label: 'Primary action',
    },
    onSecondaryAction: {
      type: 'action',
      category: 'Events',
      label: 'Secondary action',
    },
  },
} as const satisfies ZoraComponentMeta;
