import { describe, expect, test } from 'bun:test';

import { resolveThemeModeToggleState } from './resolveThemeModeToggleState';

describe('resolveThemeModeToggleState', () => {
  test('offers dark mode while light mode is active', () => {
    expect(resolveThemeModeToggleState('light')).toEqual({
      iconName: 'moon-outline',
      label: 'Use dark mode',
      nextMode: 'dark',
    });
  });

  test('offers light mode while dark mode is active', () => {
    expect(resolveThemeModeToggleState('dark')).toEqual({
      iconName: 'sunny-outline',
      label: 'Use light mode',
      nextMode: 'light',
    });
  });
});
