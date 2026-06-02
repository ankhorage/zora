import { ZORA_COLORS } from '../../internal/colorModel';
import type { ZoraComponentMeta } from '../../metadata';

export const progressMeta = {
  name: 'Progress',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Progress',
    defaultProps: {
      value: 50,
      max: 100,
      color: 'primary',
      size: 'm',
    },
  },
  props: {
    value: {
      type: 'number',
      category: 'State',
      label: 'Value',
      default: 50,
    },
    max: {
      type: 'number',
      category: 'State',
      label: 'Max',
      default: 100,
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
      default: 'primary',
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
