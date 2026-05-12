import type { ZoraComponentMeta } from '../../metadata';

export const chatListItemMeta = {
  name: 'ChatListItem',
  category: 'pattern',
  description: 'Conversation preview row with avatar, title, preview text, timestamp, and unread state.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'Chat list item',
    icon: { name: 'chatbubble-outline' },
    defaultProps: {
      title: 'Ada Lovelace',
      preview: 'Can you review the latest UI update?',
      timestamp: '2m',
      avatar: {
        name: 'Ada Lovelace',
      },
    },
  },
  props: {
    title: {
      type: 'string',
      category: 'Content',
      label: 'Title',
      default: 'Ada Lovelace',
    },
    preview: {
      type: 'string',
      category: 'Content',
      label: 'Preview',
    },
    meta: {
      type: 'string',
      category: 'Content',
      label: 'Meta',
    },
    timestamp: {
      type: 'string',
      category: 'Content',
      label: 'Timestamp',
    },
    unread: {
      type: 'boolean',
      category: 'State',
      label: 'Unread',
      default: false,
    },
    unreadCount: {
      type: 'string',
      category: 'State',
      label: 'Unread count',
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
