import { describe, expect, test } from 'bun:test';

import type { ZoraHexColor } from '../../theme/types';
import {
  createZoraColorScale,
  type CreateZoraColorScaleOptions,
  createZoraNeutralScale,
  createZoraPrimaryScale,
  parseHexToOklch,
  ZORA_COLOR_SCALE_STEPS,
  type ZoraColorScale,
  type ZoraColorScaleStep,
} from './index';

function isSixDigitLowercaseHexColor(value: string): value is ZoraHexColor {
  return /^#[0-9a-f]{6}$/.test(value);
}

function hueDeltaDegrees(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return Math.min(raw, 360 - raw);
}

function getStepValues(scale: ZoraColorScale): { step: ZoraColorScaleStep; hex: ZoraHexColor }[] {
  return ZORA_COLOR_SCALE_STEPS.map((step) => ({ step, hex: scale[step] }));
}

function assertScaleKeys(scale: ZoraColorScale) {
  const keys = Object.keys(scale)
    .map((key) => Number(key))
    .sort((a, b) => a - b);

  expect(keys).toEqual([...ZORA_COLOR_SCALE_STEPS]);
}

function assertDecreasingLightness(scale: ZoraColorScale) {
  const lightness = getStepValues(scale).map(({ hex }) => parseHexToOklch(hex).l);

  for (let index = 0; index < lightness.length - 1; index += 1) {
    expect(lightness[index]).toBeGreaterThan(lightness[index + 1]);
  }
}

describe('createZoraPrimaryScale', () => {
  test('matches createZoraColorScale({ role: primary })', () => {
    const seed: ZoraHexColor = '#0f766e';
    const options: CreateZoraColorScaleOptions = { seed, role: 'primary' };

    expect(createZoraPrimaryScale(seed)).toEqual(createZoraColorScale(options));
  });

  test('returns all 50–950 keys and valid lowercase 6-digit hex values', () => {
    const seed: ZoraHexColor = '#0f766e';
    const scale = createZoraPrimaryScale(seed);

    assertScaleKeys(scale);

    for (const { hex } of getStepValues(scale)) {
      expect(isSixDigitLowercaseHexColor(hex)).toBe(true);
    }
  });

  test('is deterministic for the same seed', () => {
    const seed: ZoraHexColor = '#0f766e';

    expect(createZoraPrimaryScale(seed)).toEqual(createZoraPrimaryScale(seed));
  });

  test('lightness decreases from 50 to 950', () => {
    const seed: ZoraHexColor = '#0f766e';
    const scale = createZoraPrimaryScale(seed);

    assertDecreasingLightness(scale);
  });

  test('preserves hue approximately for mid steps', () => {
    const seed: ZoraHexColor = '#0f766e';
    const seedOklch = parseHexToOklch(seed);
    const scale = createZoraPrimaryScale(seed);

    const midSteps: ZoraColorScaleStep[] = [400, 500, 600, 700];
    for (const step of midSteps) {
      const oklch = parseHexToOklch(scale[step]);
      expect(hueDeltaDegrees(seedOklch.h, oklch.h)).toBeLessThan(20);
    }
  });

  test('mid steps have higher chroma than extremes for a saturated seed', () => {
    const seed: ZoraHexColor = '#ff00ff';
    const scale = createZoraPrimaryScale(seed);

    const chroma50 = parseHexToOklch(scale[50]).c;
    const chroma950 = parseHexToOklch(scale[950]).c;
    const chroma500 = parseHexToOklch(scale[500]).c;
    const chroma600 = parseHexToOklch(scale[600]).c;

    const extremes = Math.max(chroma50, chroma950);
    const mid = Math.max(chroma500, chroma600);

    expect(mid).toBeGreaterThan(extremes);
  });

  test('bounds saturated inputs to stay in gamut', () => {
    const seed: ZoraHexColor = '#ff00ff';
    const scale = createZoraPrimaryScale(seed);

    for (const { hex } of getStepValues(scale)) {
      expect(isSixDigitLowercaseHexColor(hex)).toBe(true);
      expect(() => parseHexToOklch(hex)).not.toThrow();
    }
  });

  test('throws on invalid seed in test/development', () => {
    const invalid: ZoraHexColor = '#nope';

    expect(() => createZoraPrimaryScale(invalid)).toThrow();
  });
});

describe('createZoraNeutralScale', () => {
  test('works with and without a seed', () => {
    const seeded = createZoraNeutralScale('#0f766e');
    const unseeded = createZoraNeutralScale();

    assertScaleKeys(seeded);
    assertScaleKeys(unseeded);
  });

  test('returns low-chroma neutrals', () => {
    const scale = createZoraNeutralScale('#0f766e');

    for (const { hex } of getStepValues(scale)) {
      const oklch = parseHexToOklch(hex);
      expect(oklch.c).toBeLessThanOrEqual(0.03);
    }
  });

  test('lightness decreases from 50 to 950', () => {
    const scale = createZoraNeutralScale('#0f766e');

    assertDecreasingLightness(scale);
  });

  test('avoids pure black/white in the generated steps', () => {
    const scale = createZoraNeutralScale('#0f766e');
    const values = getStepValues(scale).map(({ hex }) => hex);

    expect(values).not.toContain('#000000');
    expect(values).not.toContain('#ffffff');
  });
});
