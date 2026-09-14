import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';
import type { ZoraComponentMeta } from '../../metadata/types';

export const dialogMeta = {
  name: 'Dialog',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  description: 'Modal dialog composition with title, description, content, and optional footer.',
  blueprint: {
    label: 'Dialog',
    defaultProps: { closeOnBackdrop: true, visible: false, width: 'default' },
  },
  events: {
    dismiss: { label: 'Dismiss', eventType: 'dialog.dismiss', payloadFields: [] },
  },
  props: {
    visible: { type: 'boolean', category: 'State', label: 'Visible', default: false },
    title: { type: 'string', category: 'Content', label: 'Title' },
    description: { type: 'string', category: 'Content', label: 'Description' },
    closeOnBackdrop: {
      type: 'boolean',
      category: 'Behavior',
      label: 'Close on backdrop',
      default: true,
    },
    width: {
      type: 'enum',
      category: 'Layout',
      label: 'Width',
      enum: ['narrow', 'default', 'wide'],
      default: 'default',
    },
  },
} as const satisfies ZoraComponentMeta;
