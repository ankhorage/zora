import type { ZoraComponentMeta } from '../../metadata';
import { PAGE_SECTION_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const pageSectionMeta = {
  name: 'PageSection',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...PAGE_SECTION_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Page section',
    defaultProps: {
      title: 'Section',
      description: 'Section description.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Section',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Section description.',
    },
  },
} as const satisfies ZoraComponentMeta;
