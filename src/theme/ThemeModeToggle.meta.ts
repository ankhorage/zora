import type { ZoraComponentMeta } from '../metadata';

export const themeModeToggleMeta = {
  name: 'ThemeModeToggle',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Theme mode toggle',
    defaultProps: {
      size: 'm',
    },
  },
  props: {
    disabled: {
      type: 'boolean',
      category: 'Behavior',
      label: 'Disabled',
      default: false,
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'm',
    },
  },
} as const satisfies ZoraComponentMeta;
