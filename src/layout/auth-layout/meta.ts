import type { ZoraComponentMeta } from '../../metadata';
import { SCREEN_SECTION_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const authLayoutMeta = {
  name: 'AuthLayout',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...SCREEN_SECTION_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Auth layout',
    defaultProps: {
      title: 'Welcome',
      description: 'Sign in to continue.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Welcome',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Sign in to continue.',
    },
    eyebrow: {
      type: 'string',
      category: 'Content',
      label: 'Eyebrow',
    },
  },
} as const satisfies ZoraComponentMeta;
