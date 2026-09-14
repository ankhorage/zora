import type { ZoraComponentMeta } from '../../metadata/types';

export const tabMeta = {
  name: 'Tab',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  description: 'One labeled selectable tab within a TabList.',
  blueprint: { label: 'Tab', defaultProps: { label: 'Tab', value: 'tab' } },
  props: {
    value: { type: 'string', category: 'State', label: 'Value' },
    label: { type: 'string', category: 'Content', label: 'Label' },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled' },
  },
} as const satisfies ZoraComponentMeta;
