import { CONTAINER_ALLOWED_CHILDREN } from '../../constants/authoring';
import type { ZoraComponentMeta } from '../../types/authoring';

export const masterDetailMeta = {
  name: 'MasterDetail',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description:
    'Responsive visual projection for host-owned list and detail routes. Its first child is the master list and its second child is the detail pane. Place it as a direct child of a non-scrolling Screen. On expanded widths it displays both in independently scrolling panes; on compact widths it displays the pane selected by activePane.',
  blueprint: {
    label: 'Master detail',
    defaultProps: { activePane: 'master', desktopMode: 'split', masterWidth: 30 },
  },
  bindings: {
    props: {
      activePane: {
        label: 'Active compact pane',
        description: 'Bind this to host-owned list or detail route state; ZORA does not navigate.',
        value: { type: 'string' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    activePane: {
      type: 'enum',
      category: 'Navigation',
      label: 'Active compact pane',
      enum: ['master', 'detail'],
      default: 'master',
    },
    desktopMode: {
      type: 'enum',
      category: 'Layout',
      label: 'Desktop mode',
      enum: ['split', 'master'],
      default: 'split',
    },
    masterWidth: {
      type: 'enum',
      category: 'Layout',
      label: 'Master width percent',
      enum: [25, 30, 35, 40],
      default: 30,
    },
  },
} as const satisfies ZoraComponentMeta;
