import type { ZoraComponentMeta } from '../authoring';
import { ZORA_COLORS } from '../theme/colorModel';

export const oauthProviderButtonMeta = {
  name: 'OAuthProviderButton',
  category: 'pattern',
  description: 'Renders a provider-branded OAuth action button.',
  directManifestNode: true,
  allowedChildren: [],
  blueprint: {
    label: 'OAuth provider button',
    defaultProps: {
      providerId: 'google',
      fullWidth: true,
      size: 'l',
      variant: 'outline',
      color: 'neutral',
      loading: false,
      disabled: false,
    },
  },
  events: {
    press: {
      label: 'Press',
      eventType: 'oauthProviderButton.press',
      payloadFields: [{ path: 'providerId', type: 'string', label: 'Provider ID' }],
    },
  },
  props: {
    providerId: {
      type: 'string',
      category: 'Authentication',
      label: 'Provider ID',
      default: 'google',
    },
    label: { type: 'string', category: 'Content', label: 'Label' },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
    loading: { type: 'boolean', category: 'State', label: 'Loading', default: false },
    fullWidth: { type: 'boolean', category: 'Layout', label: 'Full width', default: true },
    size: {
      type: 'enum',
      category: 'Style',
      label: 'Size',
      enum: ['s', 'm', 'l'],
      default: 'l',
    },
    variant: {
      type: 'enum',
      category: 'Style',
      label: 'Variant',
      enum: ['solid', 'outline', 'ghost', 'soft'],
      default: 'outline',
    },
    color: {
      type: 'enum',
      category: 'Style',
      label: 'Color',
      enum: [...ZORA_COLORS],
      default: 'neutral',
    },
  },
} as const satisfies ZoraComponentMeta;
