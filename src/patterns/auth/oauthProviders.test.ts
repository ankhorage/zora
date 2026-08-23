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
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.microsoft).toEqual({
      provider: 'FontAwesome5',
      name: 'microsoft',
      variant: 'brand',
    });
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.discord).toEqual({
      provider: 'FontAwesome5',
      name: 'discord',
      variant: 'brand',
    });
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.gitlab).toEqual({
      provider: 'FontAwesome5',
      name: 'gitlab',
      variant: 'brand',
    });
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.zoom).toEqual({
      provider: 'FontAwesome5',
      name: 'video',
      variant: 'solid',
    });
    expect(DEFAULT_OAUTH_PROVIDER_ICONS.x).toEqual({
      provider: 'FontAwesome6',
      name: 'x-twitter',
      variant: 'brand',
    });
  });

  it('returns undefined for custom provider icons', () => {
    expect(resolveOAuthProviderIcon('custom-sso')).toBeUndefined();
  });
});
