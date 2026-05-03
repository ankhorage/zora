import type { ZoraThemeId } from './types';

export function resolveZoraScopedThemeId({
  desiredThemeId,
  inheritedThemeId,
}: {
  desiredThemeId: ZoraThemeId | undefined;
  inheritedThemeId: ZoraThemeId;
}): ZoraThemeId {
  if (desiredThemeId === undefined || desiredThemeId === inheritedThemeId) {
    return inheritedThemeId;
  }

  const message = [
    `Unknown ZORA theme id '${desiredThemeId}'.`,
    'Theme registries are not available yet; register the theme before using themeId scopes.',
  ].join(' ');

  if (process.env.NODE_ENV === 'production') {
    console.warn(message);
    return inheritedThemeId;
  }

  throw new Error(message);
}
