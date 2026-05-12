import type { ZoraComponentMeta } from '../../metadata';
import { CONTAINER_ALLOWED_CHILDREN } from '../../metadata/allowedChildren';

export const postCardMeta = {
  name: 'PostCard',
  category: 'pattern',
  description: 'Social/content post card with author identity, body, media, actions, and comment previews.',
  directManifestNode: true,
  allowedChildren: [...CONTAINER_ALLOWED_CHILDREN],
  blueprint: {
    label: 'Post card',
    icon: { name: 'chatbubble-ellipses-outline' },
    defaultProps: {
      author: {
        name: 'Ada Lovelace',
        subtitle: '@ada · 2h',
        avatar: {
          name: 'Ada Lovelace',
        },
      },
      text: 'Share an update, image, or announcement with a reusable ZORA PostCard.',
    },
  },
  props: {
    author: {
      type: 'array',
      category: 'Content',
      label: 'Author',
      itemSchema: [
        {
          key: 'name',
          schema: {
            type: 'string',
            category: 'Content',
            label: 'Name',
          },
        },
        {
          key: 'subtitle',
          schema: {
            type: 'string',
            category: 'Content',
            label: 'Subtitle',
          },
        },
      ],
    },
    text: {
      type: 'string',
      category: 'Content',
      label: 'Text',
    },
    compact: {
      type: 'boolean',
      category: 'Layout',
      label: 'Compact',
      default: false,
    },
    tone: {
      type: 'enum',
      category: 'Style',
      label: 'Tone',
      enum: ['default', 'subtle', 'outline'],
      default: 'default',
    },
  },
} as const satisfies ZoraComponentMeta;
