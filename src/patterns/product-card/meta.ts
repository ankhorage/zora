import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const productCardMeta = {
  name: 'ProductCard',
  category: 'pattern',
  description: 'A generic card for displaying product or article information.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
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
  },
} as const satisfies ZoraComponentMeta;
