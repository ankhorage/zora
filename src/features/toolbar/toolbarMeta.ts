import type { ZoraComponentMeta } from '../../types/authoring';

export const toolbarMeta = {
  name: 'Toolbar',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [
    'Button',
    'IconButton',
    'SearchInput',
    'Select',
    'Chip',
    'ChipGroup',
    'Text',
    'Divider',
  ],
  description:
    'Visible horizontal group of contextual actions and controls; layout owns placement.',
  blueprint: { label: 'Toolbar', defaultProps: { compact: true, floating: false } },
  props: {
    floating: { type: 'boolean', category: 'Style', label: 'Floating', default: false },
    compact: { type: 'boolean', category: 'Layout', label: 'Compact', default: true },
  },
} as const satisfies ZoraComponentMeta;
