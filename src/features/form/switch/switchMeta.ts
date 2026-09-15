import type { ZoraComponentMeta } from '../../authoring';

export const switchMeta = {
  name: 'Switch',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Switch', defaultProps: { children: 'Option', checked: false } },
  props: {
    children: { type: 'string', category: 'Content', label: 'Label' },
    checked: { type: 'boolean', category: 'State', label: 'Checked', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
  },
} as const satisfies ZoraComponentMeta;
