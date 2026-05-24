import { describe, expect, it } from 'bun:test';

import {
  DEFAULT_OAUTH_PROVIDER_ICONS,
  resolveOAuthProviderIcon,
  resolveOAuthProviderLabel,
} from './oauthProviders';

describe('OAuth provider UI helpers', () => {
  it('resolves known provider labels', () => {
    expect(resolveOAuthProviderLabel('google')).toBe('Google');
    expect(resolveOAuthProviderLabel('github')).toBe('GitHub');
    expect(resolveOAuthProviderLabel('linkedin')).toBe('LinkedIn');
  });

  it('formats custom provider labels', () => {
    expect(resolveOAuthProviderLabel('custom-sso')).toBe('Custom Sso');
    expect(resolveOAuthProviderLabel(' enterprise_idp ')).toBe('Enterprise Idp');
    expect(resolveOAuthProviderLabel('')).toBe('Provider');
  });

  it('resolves known provider icons', () => {
    expect(resolveOAuthProviderIcon('google')).toEqual({ provider: 'FontAwesome', name: 'google' });
    expect(resolveOAuthProviderIcon('github')).toEqual({ provider: 'FontAwesome', name: 'github' });
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.apple).toEqual({ provider: 'FontAwesome', name: 'apple' });
  });

  it('returns undefined for custom provider icons', () => {
    expect(resolveOAuthProviderIcon('custom-sso')).toBeUndefined();
  });
});
