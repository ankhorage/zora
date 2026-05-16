import type { ZoraComponentMeta } from '../../metadata';

export const buttonGroupMeta = {
  name: 'ButtonGroup',
  category: 'component',
  directManifestNode: true,
  allowedChildren: ['Button', 'IconButton'],
  blueprint: {
    label: 'Button group',
    defaultProps: {
      align: 'end',
      orientation: 'horizontal',
      gap: 's',
    },
  },
  props: {
    align: {
      type: 'enum',
      category: 'Layout',
      label: 'Align',
      enum: ['start', 'center', 'end', 'stretch', 'between'],
      default: 'end',
    },
    orientation: {
      type: 'enum',
      category: 'Layout',
      label: 'Orientation',
      enum: ['horizontal', 'vertical', 'responsive'],
      default: 'horizontal',
    },
    gap: {
      type: 'enum',
      category: 'Layout',
      label: 'Gap',
      enum: ['xs', 's', 'm', 'l'],
      default: 's',
    },
    reverse: {
      type: 'boolean',
      category: 'Layout',
      label: 'Reverse order',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
