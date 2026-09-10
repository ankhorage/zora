import type { ZoraComponentMeta } from '../../metadata/types';
import { avatarMeta } from './avatarMeta';

export const avatarGroupMeta = {
  name: 'AvatarGroup',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: { label: 'Avatar group', defaultProps: { items: [] } },
  props: {
    items: {
      type: 'array',
      category: 'Content',
      itemSchema: [
        { key: 'id', schema: { type: 'string', category: 'Identity' } },
        ...Object.entries(avatarMeta.props)
          .filter(([key]) => key !== 'size' && key !== 'shape')
          .map(([key, schema]) => ({ key, schema })),
      ],
    },
    max: { type: 'number', category: 'Layout' },
    size: avatarMeta.props.size,
    shape: avatarMeta.props.shape,
  },
} as const satisfies ZoraComponentMeta;
