import { describe, expect, test } from 'bun:test';

import type { ZoraHexColor } from '../../theme/types';
import { normalizeHueDegrees } from './hue';
import {
  computeZoraHarmony,
  parseHexToOklch,
  type ZoraComputedHarmony,
  type ZoraHarmonySlot,
  type ZoraHarmonySlotId,
} from './index';

function hueDeltaDegrees(a: number, b: number): number {
  const raw = Math.abs(a - b) % 360;
  return Math.min(raw, 360 - raw);
}

function expectNormalizedHue(hue: number) {
  expect(hue).toBeGreaterThanOrEqual(0);
  expect(hue).toBeLessThan(360);
}

function getSlotIds(slots: readonly ZoraHarmonySlot[]): ZoraHarmonySlotId[] {
  return slots.map((slot) => slot.id);
}

describe('computeZoraHarmony', () => {
  test('monochromatic returns 1 slot', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'monochromatic');

    expect(harmony.orderedSlots).toHaveLength(1);
    expect(harmony.orderedSlots[0].id).toBe('base');
  });

  test('complementary returns 2 slots', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'complementary');

    expect(harmony.orderedSlots).toHaveLength(2);
    expect(harmony.orderedSlots[0].id).toBe('base');
    expect(harmony.orderedSlots[1].id).toBe('a');
  });

  test('analogous returns 3 slots', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'analogous');

    expect(harmony.orderedSlots).toHaveLength(3);
    expect(getSlotIds(harmony.orderedSlots)).toEqual(['base', 'a', 'b']);
  });

  test('splitComplementary returns 3 slots', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'splitComplementary');

    expect(harmony.orderedSlots).toHaveLength(3);
    expect(getSlotIds(harmony.orderedSlots)).toEqual(['base', 'a', 'b']);
  });

  test('triadic returns 3 slots', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'triadic');

    expect(harmony.orderedSlots).toHaveLength(3);
    expect(getSlotIds(harmony.orderedSlots)).toEqual(['base', 'a', 'b']);
  });

  test('tetradic returns 4 slots', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony: ZoraComputedHarmony = computeZoraHarmony(seed, 'tetradic');

    expect(harmony.orderedSlots).toHaveLength(4);
    expect(getSlotIds(harmony.orderedSlots)).toEqual(['base', 'a', 'b', 'c']);
  });

  test('every computed hue is normalized to [0, 360)', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmonies = [
      'monochromatic',
      'complementary',
      'analogous',
      'splitComplementary',
      'triadic',
      'tetradic',
    ] as const;

    for (const kind of harmonies) {
      const computed = computeZoraHarmony(seed, kind);
      for (const slot of computed.orderedSlots) {
        expectNormalizedHue(slot.hue);
      }
    }
  });

  test('base slot approximately matches parsed seed hue for a non-neutral seed', () => {
    const seed: ZoraHexColor = '#ff00ff';
    const seedOklch = parseHexToOklch(seed);

    const computed = computeZoraHarmony(seed, 'complementary');
    const [base] = computed.orderedSlots;

    expect(base).toBeDefined();
    if (!base) {
      throw new Error('Expected a base harmony slot.');
    }

    expect(base.id).toBe('base');
    expect(hueDeltaDegrees(seedOklch.h, base.hue)).toBeLessThan(0.5);
  });

  test('neutral/low-chroma seed uses a stable fallback hue', () => {
    const seed: ZoraHexColor = '#808080';
    const computed = computeZoraHarmony(seed, 'monochromatic');

    expect(computed.orderedSlots).toHaveLength(1);
    expect(computed.orderedSlots[0].hue).toBe(260);
  });

  test('is deterministic for the same seed/harmony', () => {
    const seed: ZoraHexColor = '#0f766e';

    expect(computeZoraHarmony(seed, 'triadic')).toEqual(computeZoraHarmony(seed, 'triadic'));
  });

  test('complementary slots are based on base hue + 180', () => {
    const seed: ZoraHexColor = '#0f766e';
    const computed = computeZoraHarmony(seed, 'complementary');
    const [base, a] = computed.orderedSlots;

    expect(base).toBeDefined();
    expect(a).toBeDefined();
    if (!base || !a) {
      throw new Error('Expected complementary harmony slots.');
    }

    expect(hueDeltaDegrees(a.hue, normalizeHueDegrees(base.hue + 180))).toBeLessThan(0.0001);
  });

  test('throws on invalid seed in test/development', () => {
    const invalid: ZoraHexColor = '#nope';

    expect(() => computeZoraHarmony(invalid, 'triadic')).toThrow();
  });
});
