import type { ZoraComponentMeta } from '../../metadata';

export const settingsRowMeta = {
  name: 'SettingsRow',
  category: 'pattern',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Settings row',
    defaultProps: {
      title: 'Setting',
      description: 'Setting description.',
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Setting',
    },
    description: {
      type: 'string',
      category: 'Content',
      label: 'Description',
      default: 'Setting description.',
    },
    meta: {
      type: 'string',
      category: 'Content',
      label: 'Meta',
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
