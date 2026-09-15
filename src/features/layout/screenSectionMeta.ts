import type { ZoraComponentMeta } from '../../metadata';
import { SCREEN_SECTION_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const screenSectionMeta = {
  name: 'ScreenSection',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...SCREEN_SECTION_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Screen section',
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
