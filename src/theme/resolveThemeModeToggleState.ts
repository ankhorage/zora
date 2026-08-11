import type { ZoraThemeMode } from './types';

interface ThemeModeToggleState {
  readonly iconName: 'moon-outline' | 'sunny-outline';
  readonly label: 'Use dark mode' | 'Use light mode';
  readonly nextMode: ZoraThemeMode;
}

export function resolveThemeModeToggleState(mode: ZoraThemeMode): ThemeModeToggleState {
  return mode === 'dark'
    ? {
        iconName: 'sunny-outline',
        label: 'Use light mode',
        nextMode: 'light',
      }
    : {
        iconName: 'moon-outline',
        label: 'Use dark mode',
        nextMode: 'dark',
      };
}
