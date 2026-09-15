import type { ZoraComponentMeta } from '../authoring';
import { ZORA_COLORS } from '../theme/colorModel';

export const oauthProviderListMeta = {
  name: 'OAuthProviderList',
  category: 'pattern',
  description: 'Renders a configurable group of OAuth provider actions.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'OAuth provider list',
    defaultProps: {
      providers: [{ id: 'google', label: 'Continue with Google' }],
      layout: 'stack',
      loading: false,
      disabled: false,
    },
  },
  events: {
    providerPress: {
      label: 'Provider press',
      eventType: 'oauthProviderList.providerPress',
      payloadFields: [{ path: 'providerId', type: 'string', label: 'Provider ID' }],
    },
  },
  props: {
    providers: {
      type: 'array',
      category: 'Authentication',
      label: 'Providers',
      itemSchema: [
        { key: 'id', schema: { type: 'string', category: 'Identity', label: 'Provider ID' } },
        { key: 'label', schema: { type: 'string', category: 'Content', label: 'Label' } },
        { key: 'disabled', schema: { type: 'boolean', category: 'State', label: 'Disabled' } },
        { key: 'loading', schema: { type: 'boolean', category: 'State', label: 'Loading' } },
      ],
    },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    fullWidth: { type: 'boolean', category: 'Layout', label: 'Full width' },
    layout: {
      type: 'enum',
      category: 'Layout',
      label: 'Layout',
      enum: ['stack', 'inline'],
      default: 'stack',
    },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
    },
    variant: {
      type: 'enum',
      category: 'Style',
      label: 'Variant',
      enum: ['solid', 'outline', 'ghost', 'soft'],
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
    },
  },
} as const satisfies ZoraComponentMeta;
