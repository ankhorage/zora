import { describe, expect, test } from 'bun:test';

import { parseHexToOklch } from '../internal/color';
import { createZoraThemeConfig } from './createZoraThemeConfig';
import type { ZoraHexColor } from './types';

function isSixDigitHexColor(value: string): value is ZoraHexColor {
  return /^#[0-9a-f]{6}$/.test(value);
}

describe('createZoraThemeConfig', () => {
  test('converts the default theme seed into a surface config', () => {
    const themeConfig = createZoraThemeConfig();

    expect(themeConfig.id).toBe('zora');
    expect(themeConfig.name).toBe('ZORA');
    expect(isSixDigitHexColor(themeConfig.light.primaryColor)).toBe(true);
    expect(themeConfig.light.harmony).toBe('analogous');
    expect(themeConfig.light.colorTone).toBe('jewel');
    expect(isSixDigitHexColor(themeConfig.dark.primaryColor)).toBe(true);
    expect(themeConfig.dark.harmony).toBe('analogous');
    expect(themeConfig.dark.colorTone).toBe('jewel');

    expect(themeConfig.light.primaryColor).not.toBe(themeConfig.dark.primaryColor);

    const lightOklch = parseHexToOklch(themeConfig.light.primaryColor);
    const darkOklch = parseHexToOklch(themeConfig.dark.primaryColor);
    expect(darkOklch.l).toBeGreaterThan(lightOklch.l);
  });

  test('falls back to id when name is omitted', () => {
    const themeConfig = createZoraThemeConfig({
      id: 'studio',
      primaryColor: '#0f766e',
      harmony: 'analogous',
      colorTone: 'jewel',
    });

    expect(themeConfig.id).toBe('studio');
    expect(themeConfig.name).toBe('studio');
    expect(isSixDigitHexColor(themeConfig.light.primaryColor)).toBe(true);
    expect(themeConfig.light.harmony).toBe('analogous');
    expect(themeConfig.light.colorTone).toBe('jewel');
    expect(isSixDigitHexColor(themeConfig.dark.primaryColor)).toBe(true);
    expect(themeConfig.dark.harmony).toBe('analogous');
    expect(themeConfig.dark.colorTone).toBe('jewel');

    expect(themeConfig.light.primaryColor).not.toBe(themeConfig.dark.primaryColor);
  });
});
