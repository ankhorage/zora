import type { ZoraComponentMeta } from '../../metadata';

export const pageHeaderMeta = {
  name: 'PageHeader',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Page header',
    defaultProps: {
      title: 'Page title',
      description: 'Short description.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Page title',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Short description.',
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
    },
    meta: {
      type: 'string',
      category: 'Content',
      label: 'Meta',
    },
  },
} as const satisfies ZoraComponentMeta;
