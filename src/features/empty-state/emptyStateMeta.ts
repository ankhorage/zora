import type { ZoraComponentMeta } from '../../metadata';

export const emptyStateMeta = {
  name: 'EmptyState',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Empty state',
    defaultProps: {
      title: 'Nothing here yet',
      description: 'Try adding your first item.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Nothing here yet',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Try adding your first item.',
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
    },
  },
} as const satisfies ZoraComponentMeta;
