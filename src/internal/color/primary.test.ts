import { describe, expect, test } from 'bun:test';

import type { ZoraHexColor } from '../../theme/types';
import { parseHexToOklch } from './oklch';
import { resolveModePrimaryColor } from './primary';

function isSixDigitHexColor(value: string): value is ZoraHexColor {
  return /^#[0-9a-f]{6}$/.test(value);
}

function hueDeltaDegrees(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return Math.min(raw, 360 - raw);
}

describe('resolveModePrimaryColor', () => {
  test('returns valid hex for light and dark mode', () => {
    const seed: ZoraHexColor = '#0f766e';

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    expect(isSixDigitHexColor(light)).toBe(true);
    expect(isSixDigitHexColor(dark)).toBe(true);
  });

  test('derives different colors for light vs dark for a typical saturated seed', () => {
    const seed: ZoraHexColor = '#0f766e';

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    expect(light).not.toBe(dark);
  });

  test('dark derived primary has higher OKLCH lightness than the light derived primary', () => {
    const seed: ZoraHexColor = '#0f766e';

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    const lightOklch = parseHexToOklch(light);
    const darkOklch = parseHexToOklch(dark);

    expect(darkOklch.l).toBeGreaterThan(lightOklch.l);
  });

  test('preserves hue approximately for a non-neutral seed', () => {
    const seed: ZoraHexColor = '#0f766e';
    const seedOklch = parseHexToOklch(seed);

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    const lightOklch = parseHexToOklch(light);
    const darkOklch = parseHexToOklch(dark);

    expect(hueDeltaDegrees(seedOklch.h, lightOklch.h)).toBeLessThan(20);
    expect(hueDeltaDegrees(seedOklch.h, darkOklch.h)).toBeLessThan(20);
  });

  test('bounds chroma', () => {
    const seed: ZoraHexColor = '#ff00ff';

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    const lightOklch = parseHexToOklch(light);
    const darkOklch = parseHexToOklch(dark);

    expect(lightOklch.c).toBeLessThanOrEqual(0.18 + 0.01);
    expect(darkOklch.c).toBeLessThanOrEqual(0.2 + 0.01);
  });

  test('handles low-chroma colors without crashing', () => {
    const seed: ZoraHexColor = '#808080';

    const light = resolveModePrimaryColor(seed, 'light');
    const dark = resolveModePrimaryColor(seed, 'dark');

    expect(isSixDigitHexColor(light)).toBe(true);
    expect(isSixDigitHexColor(dark)).toBe(true);
  });

  test('throws on invalid hex in test/development', () => {
    const invalid: ZoraHexColor = '#nope';

    expect(() => resolveModePrimaryColor(invalid, 'light')).toThrow();
  });

  test('falls back in production when input is invalid', () => {
    const invalid: ZoraHexColor = '#nope';

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      const resolved = resolveModePrimaryColor(invalid, 'light');
      expect(resolved).not.toBe('#0f766e');
      expect(resolved).toBe(resolveModePrimaryColor('#0f766e', 'light'));
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  });
});
