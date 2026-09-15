import type { ZoraComponentMeta } from '../../types/authoring';
import { CONTAINER_ALLOWED_CHILDREN } from '../authoring/allowedChildren';

export const keyboardAvoidingViewMeta = {
  name: 'KeyboardAvoidingView',
  category: 'layout',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Keyboard avoiding view',
    defaultProps: {
      behavior: 'padding',
      enabled: true,
      keyboardVerticalOffset: 0,
    },
  },
  props: {
    behavior: {
      type: 'enum',
      category: 'Behavior',
      label: 'Behavior',
      enum: ['height', 'position', 'padding'],
      default: 'padding',
    },
    enabled: {
      type: 'boolean',
      category: 'Behavior',
      label: 'Enabled',
      default: true,
    },
    keyboardVerticalOffset: {
      type: 'number',
      category: 'Layout',
      label: 'Keyboard vertical offset',
      default: 0,
    },
  },
} as const satisfies ZoraComponentMeta;
