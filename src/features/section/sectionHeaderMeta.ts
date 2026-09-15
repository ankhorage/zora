import type { ZoraComponentMeta } from '../../metadata';

export const sectionHeaderMeta = {
  name: 'SectionHeader',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Section header',
    defaultProps: {
      title: 'Section title',
      description: 'Short description.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Section title',
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
  },
} as const satisfies ZoraComponentMeta;
