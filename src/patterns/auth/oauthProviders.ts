import type { OAuthProviderIconSpec } from './types';

export const DEFAULT_OAUTH_PROVIDER_ICONS = {
  apple: { provider: 'FontAwesome', name: 'apple' },
  azure: { provider: 'FontAwesome5', name: 'microsoft' },
  bitbucket: { provider: 'FontAwesome', name: 'bitbucket' },
  discord: { provider: 'FontAwesome5', name: 'discord' },
  facebook: { provider: 'FontAwesome', name: 'facebook' },
  figma: { provider: 'FontAwesome5', name: 'figma' },
  github: { provider: 'FontAwesome', name: 'github' },
  gitlab: { provider: 'FontAwesome5', name: 'gitlab' },
  google: { provider: 'FontAwesome', name: 'google' },
  linkedin: { provider: 'FontAwesome', name: 'linkedin' },
  microsoft: { provider: 'FontAwesome5', name: 'microsoft' },
  slack: { provider: 'FontAwesome5', name: 'slack' },
  spotify: { provider: 'FontAwesome', name: 'spotify' },
  twitch: { provider: 'FontAwesome5', name: 'twitch' },
  twitter: { provider: 'FontAwesome', name: 'twitter' },
  x: { provider: 'FontAwesome6', name: 'x-twitter' },
  zoom: { provider: 'FontAwesome5', name: 'video' },
} as const satisfies Record<string, OAuthProviderIconSpec>;

const DEFAULT_OAUTH_PROVIDER_LABELS = {
  apple: 'Apple',
  azure: 'Microsoft',
  bitbucket: 'Bitbucket',
  discord: 'Discord',
  facebook: 'Facebook',
  figma: 'Figma',
  github: 'GitHub',
  gitlab: 'GitLab',
  google: 'Google',
  kakao: 'Kakao',
  keycloak: 'Keycloak',
  linkedin: 'LinkedIn',
  microsoft: 'Microsoft',
  notion: 'Notion',
  slack: 'Slack',
  spotify: 'Spotify',
  twitch: 'Twitch',
  twitter: 'Twitter',
  workos: 'WorkOS',
  x: 'X',
  zoom: 'Zoom',
} as const satisfies Record<string, string>;

const oauthProviderIcons = new Map<string, OAuthProviderIconSpec>(
  Object.entries(DEFAULT_OAUTH_PROVIDER_ICONS),
);
const oauthProviderLabels = new Map<string, string>(Object.entries(DEFAULT_OAUTH_PROVIDER_LABELS));

export function resolveOAuthProviderIcon(providerId: string): OAuthProviderIconSpec | undefined {
  return oauthProviderIcons.get(normalizeOAuthProviderId(providerId));
}

export function resolveOAuthProviderLabel(providerId: string): string {
  const normalizedProviderId = normalizeOAuthProviderId(providerId);
  const knownLabel = oauthProviderLabels.get(normalizedProviderId);

  return knownLabel ?? titleCaseProviderId(normalizedProviderId);
}

function normalizeOAuthProviderId(providerId: string): string {
  return providerId.trim().toLowerCase();
}

function titleCaseProviderId(providerId: string): string {
  const words = providerId
    .split(/[-_\s]+/u)
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return 'Provider';
  }

  return words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
}
