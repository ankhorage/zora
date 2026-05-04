import { describe, expect, test } from 'bun:test';

import type { ZoraColorTone, ZoraHexColor } from '../../theme/types';
import {
  assignZoraHarmonyRoleHues,
  computeZoraHarmony,
  createZoraRoleColorScales,
  createZoraSemanticColorTokens,
  getReadableTextColor,
  type ZoraComputedRoleColorScales,
  type ZoraSemanticColorTokens,
} from './index';

function isSixDigitLowercaseHex(value: string): value is ZoraHexColor {
  return /^#[0-9a-f]{6}$/.test(value);
}

function getLightness(hex: ZoraHexColor): number {
  // Intentionally a simple RGB average rather than OKLCH — serves as a
  // perceptual proxy for test assertions only. The production implementation
  // in getReadableTextColor uses OKLCH lightness via parseHexToOklch.
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return (r + g + b) / 3;
}

function buildRoleScales(colorTone: ZoraColorTone = 'jewel'): ZoraComputedRoleColorScales {
  const seed: ZoraHexColor = '#0f766e';
  const harmony = computeZoraHarmony(seed, 'tetradic');
  const hueRoles = assignZoraHarmonyRoleHues(harmony);
  return createZoraRoleColorScales({ colorTone, hueRoles, seed });
}

function buildLight(colorTone: ZoraColorTone = 'jewel'): ZoraSemanticColorTokens {
  return createZoraSemanticColorTokens({
    roleScales: buildRoleScales(colorTone),
    mode: 'light',
    colorTone,
  });
}

function buildDark(colorTone: ZoraColorTone = 'jewel'): ZoraSemanticColorTokens {
  return createZoraSemanticColorTokens({
    roleScales: buildRoleScales(colorTone),
    mode: 'dark',
    colorTone,
  });
}

describe('createZoraSemanticColorTokens', () => {
  test('all output values are lowercase 6-digit hex', () => {
    const light = buildLight();
    const dark = buildDark();

    for (const tokens of [light, dark]) {
      for (const key of Object.keys(tokens) as (keyof ZoraSemanticColorTokens)[]) {
        const value = tokens[key];
        expect(isSixDigitLowercaseHex(value), `${key} must be lowercase 6-digit hex`).toBe(true);
      }
    }
  });

  test('light mode background is lighter than dark mode background', () => {
    const light = buildLight();
    const dark = buildDark();

    expect(getLightness(light.background)).toBeGreaterThan(getLightness(dark.background));
  });

  test('text has opposite lightness direction from background (light mode)', () => {
    const light = buildLight();

    expect(getLightness(light.text)).toBeLessThan(getLightness(light.background));
  });

  test('text has opposite lightness direction from background (dark mode)', () => {
    const dark = buildDark();

    expect(getLightness(dark.text)).toBeGreaterThan(getLightness(dark.background));
  });

  test('primary, accent, and highlight are distinct from background and surface (light)', () => {
    const light = buildLight();

    for (const token of [light.primary, light.accent, light.highlight] as const) {
      expect(token).not.toBe(light.background);
      expect(token).not.toBe(light.surface);
    }
  });

  test('primary, accent, and highlight are distinct from background and surface (dark)', () => {
    const dark = buildDark();

    for (const token of [dark.primary, dark.accent, dark.highlight] as const) {
      expect(token).not.toBe(dark.background);
      expect(token).not.toBe(dark.surface);
    }
  });

  test('onPrimary is readable against primary (light mode)', () => {
    const light = buildLight();
    const primaryL = getLightness(light.primary);
    const onPrimaryL = getLightness(light.onPrimary);

    expect(Math.abs(primaryL - onPrimaryL)).toBeGreaterThan(0.3);
  });

  test('onPrimary is readable against primary (dark mode)', () => {
    const dark = buildDark();
    const primaryL = getLightness(dark.primary);
    const onPrimaryL = getLightness(dark.onPrimary);

    expect(Math.abs(primaryL - onPrimaryL)).toBeGreaterThan(0.3);
  });

  test('onAccent is readable against accent (light mode)', () => {
    const light = buildLight();
    const accentL = getLightness(light.accent);
    const onAccentL = getLightness(light.onAccent);

    expect(Math.abs(accentL - onAccentL)).toBeGreaterThan(0.3);
  });

  test('colorTone changes at least one output token between neutral and fluorescent', () => {
    const lightNeutral = buildLight('neutral');
    const lightFluorescent = buildLight('fluorescent');

    const tokens: (keyof ZoraSemanticColorTokens)[] = [
      'primary',
      'secondary',
      'accent',
      'highlight',
    ];

    const anyChanged = tokens.some((k) => lightNeutral[k] !== lightFluorescent[k]);
    expect(anyChanged).toBe(true);
  });

  test('output is deterministic for same input', () => {
    const first = buildLight();
    const second = buildLight();

    expect(first).toEqual(second);
  });

  test('surface is distinct from surfaceRaised in dark mode', () => {
    const dark = buildDark();

    expect(dark.surface).not.toBe(dark.surfaceRaised);
  });
});

describe('getReadableTextColor', () => {
  test('returns the candidate with greater lightness difference from background', () => {
    const background: ZoraHexColor = '#ffffff';
    const dark: ZoraHexColor = '#111111';
    const light: ZoraHexColor = '#eeeeee';

    expect(getReadableTextColor(background, [dark, light])).toBe(dark);
  });

  test('returns the lighter candidate when background is dark', () => {
    const background: ZoraHexColor = '#111111';
    const dark: ZoraHexColor = '#333333';
    const light: ZoraHexColor = '#eeeeee';

    expect(getReadableTextColor(background, [dark, light])).toBe(light);
  });
});
