import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

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
  bindings: {
    props: {
      visible: {
        label: 'Visible',
        description: 'Whether the dialog is currently visible.',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
    events: {
      dismiss: {
        label: 'Dismiss',
        description: 'Runs when the dialog requests dismissal.',
        payload: { eventType: 'dialog.dismiss', fields: [] },
      },
    },
  },
  events: {
    dismiss: { label: 'Dismiss', eventType: 'dialog.dismiss', payloadFields: [] },
  },
  slots: {
    children: { label: 'Content', allowedChildren: [...CONTAINER_ALLOWED_CHILDREN] },
    footer: {
      label: 'Footer',
      allowedChildren: ['Button', 'ButtonGroup', 'Stack', 'Toolbar'],
    },
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
