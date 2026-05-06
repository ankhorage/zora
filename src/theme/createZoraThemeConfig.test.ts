import { describe, expect, test } from 'bun:test';

import { createZoraThemeConfig } from './createZoraThemeConfig';
import { zoraDefaultTheme } from './zoraDefaultTheme';

describe('createZoraThemeConfig', () => {
  test('converts the default theme seed into a surface config', () => {
    const themeConfig = createZoraThemeConfig();

    expect(themeConfig.id).toBe('zora');
    expect(themeConfig.name).toBe('ZORA');
    expect(themeConfig.light.primaryColor).toBe(zoraDefaultTheme.primaryColor);
    expect(themeConfig.light.harmony).toBe('analogous');
    expect(themeConfig.dark.primaryColor).toBe(zoraDefaultTheme.primaryColor);
    expect(themeConfig.dark.harmony).toBe('analogous');
  });

  test('uses theme.name directly without fallback to id', () => {
    const themeConfig = createZoraThemeConfig({
      id: 'studio',
      name: 'Studio',
      appCategory: 'developer_tools',
      primaryColor: '#0f766e',
      harmony: 'analogous',
    });

    expect(themeConfig.id).toBe('studio');
    expect(themeConfig.name).toBe('Studio');
  });

  test('preserves the same primaryColor for both light and dark', () => {
    const primary = '#2563eb';
    const themeConfig = createZoraThemeConfig({
      id: 'test',
      name: 'Test',
      appCategory: 'utilities_tools',
      primaryColor: primary,
      harmony: 'triadic',
    });

    expect(themeConfig.light.primaryColor).toBe(primary);
    expect(themeConfig.dark.primaryColor).toBe(primary);
  });

  test('validates public primaryColor strings during config conversion', () => {
    expect(() =>
      createZoraThemeConfig({
        id: 'bad-theme',
        name: 'Bad Theme',
        appCategory: 'utilities_tools',
        primaryColor: 'blue',
        harmony: 'triadic',
      }),
    ).toThrow();
  });

  test('output has no colorTone field', () => {
    const themeConfig = createZoraThemeConfig();

    expect('colorTone' in themeConfig.light).toBe(false);
    expect('colorTone' in themeConfig.dark).toBe(false);
  });

  test('surfaceConfig.name equals theme.name', () => {
    const themeConfig = createZoraThemeConfig({
      id: 'my-theme',
      name: 'My Theme',
      appCategory: 'games',
      primaryColor: '#7c3aed',
      harmony: 'complementary',
    });

    expect(themeConfig.name).toBe('My Theme');
  });
});
