import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const messageBubbleMeta = {
  name: 'MessageBubble',
  category: 'pattern',
  description: 'Chat/message bubble with direction, author, text, meta, and delivery status presentation.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Message bubble',
    icon: { name: 'chatbubble-outline' },
    defaultProps: {
      direction: 'incoming',
      text: 'Can you review the latest message pattern?',
      timestamp: '10:41',
    },
  },
  props: {
    direction: {
      type: 'enum',
      category: 'Content',
      label: 'Direction',
      enum: ['incoming', 'outgoing', 'system'],
      default: 'incoming',
    },
    text: {
      type: 'string',
      category: 'Content',
      label: 'Text',
    },
    timestamp: {
      type: 'string',
      category: 'Content',
      label: 'Timestamp',
    },
    meta: {
      type: 'string',
      category: 'Content',
      label: 'Meta',
    },
    status: {
      type: 'enum',
      category: 'Content',
      label: 'Status',
      enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    },
    selected: {
      type: 'boolean',
      category: 'State',
      label: 'Selected',
      default: false,
    },
    disabled: {
      type: 'boolean',
      category: 'State',
      label: 'Disabled',
      default: false,
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
    },
  },
} as const satisfies ZoraComponentMeta;
