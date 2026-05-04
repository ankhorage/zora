import { describe, expect, test } from 'bun:test';

import type { ZoraColorTone, ZoraHexColor } from '../../theme/types';
import {
  assignZoraHarmonyRoleHues,
  computeZoraHarmony,
  createZoraRoleColorScales,
  getZoraRoleColorScale,
  parseHexToOklch,
  ZORA_COLOR_SCALE_ROLE_ORDER,
  ZORA_COLOR_SCALE_STEPS,
  type ZoraColorScale,
  type ZoraColorScaleStep,
  type ZoraComputedHueRoles,
  type ZoraRoleColorScale,
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

function assertNoPureBlackOrWhite(scale: ZoraColorScale) {
  const values = getStepValues(scale).map(({ hex }) => hex);
  expect(values).not.toContain('#000000');
  expect(values).not.toContain('#ffffff');
}

function buildHueRoles(assignments: ZoraComputedHueRoles['assignments']): ZoraComputedHueRoles {
  return {
    harmony: 'tetradic',
    assignments,
  };
}

function createCompleteHueRoles(): ZoraComputedHueRoles {
  return buildHueRoles([
    { role: 'primary', hue: 120, sourceSlotId: 'base' },
    { role: 'secondary', hue: 200, sourceSlotId: 'a' },
    { role: 'accent', hue: 280, sourceSlotId: 'b' },
    { role: 'highlight', hue: 20, sourceSlotId: 'c' },
    { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
  ]);
}

function createScales(colorTone: ZoraColorTone = 'jewel') {
  return createZoraRoleColorScales({
    colorTone,
    hueRoles: createCompleteHueRoles(),
    seed: '#0f766e',
  });
}

function requireHueBackedSourceHue(role: ZoraRoleColorScale): number {
  if (typeof role.sourceHue !== 'number') {
    throw new Error(`[zora] Expected "${role.role}" role scale to include a sourceHue.`);
  }
  return role.sourceHue;
}

describe('createZoraRoleColorScales', () => {
  test('returns all roles exactly once in deterministic order', () => {
    const scales = createScales();

    expect(scales.roles).toHaveLength(ZORA_COLOR_SCALE_ROLE_ORDER.length);
    expect(scales.roles.map((entry) => entry.role)).toEqual([...ZORA_COLOR_SCALE_ROLE_ORDER]);
    expect(new Set(scales.roles.map((entry) => entry.role)).size).toBe(
      ZORA_COLOR_SCALE_ROLE_ORDER.length,
    );
  });

  test('every scale contains exactly all 50–950 keys and valid lowercase 6-digit hex values', () => {
    const scales = createScales();

    for (const role of scales.roles) {
      assertScaleKeys(role.scale);
      for (const { hex } of getStepValues(role.scale)) {
        expect(isSixDigitLowercaseHexColor(hex)).toBe(true);
      }
    }
  });

  test('output is deterministic for the same input', () => {
    expect(createScales()).toEqual(createScales());
  });

  test('role hue is preserved approximately for mid steps', () => {
    const scales = createZoraRoleColorScales({
      colorTone: 'jewel',
      hueRoles: buildHueRoles([
        { role: 'primary', hue: 115, sourceSlotId: 'base' },
        { role: 'secondary', hue: 210, sourceSlotId: 'a' },
        { role: 'accent', hue: 300, sourceSlotId: 'b' },
        { role: 'highlight', hue: 25, sourceSlotId: 'c' },
        { role: 'surfaceTint', hue: 165, sourceSlotId: 'a' },
      ]),
      seed: '#0f766e',
    });

    const midSteps: ZoraColorScaleStep[] = [400, 500, 600, 700];
    for (const roleId of ['primary', 'secondary', 'accent', 'highlight', 'surfaceTint'] as const) {
      const role = getZoraRoleColorScale(scales, roleId);
      const expectedHue = requireHueBackedSourceHue(role);

      for (const step of midSteps) {
        const oklch = parseHexToOklch(role.scale[step]);
        expect(hueDeltaDegrees(expectedHue, oklch.h)).toBeLessThan(25);
      }
    }
  });

  test('surfaceTint scale has lower chroma than primary/accent/highlight for mid steps', () => {
    const scales = createScales('jewel');
    const surfaceTint = getZoraRoleColorScale(scales, 'surfaceTint').scale;
    const primary = getZoraRoleColorScale(scales, 'primary').scale;
    const accent = getZoraRoleColorScale(scales, 'accent').scale;
    const highlight = getZoraRoleColorScale(scales, 'highlight').scale;
    const step: ZoraColorScaleStep = 500;
    const surfaceTintChroma = parseHexToOklch(surfaceTint[step]).c;

    expect(surfaceTintChroma).toBeLessThan(parseHexToOklch(primary[step]).c);
    expect(surfaceTintChroma).toBeLessThan(parseHexToOklch(accent[step]).c);
    expect(surfaceTintChroma).toBeLessThan(parseHexToOklch(highlight[step]).c);
  });

  test('colorTone changes role chroma behavior internally', () => {
    const neutral = createScales('neutral');
    const fluorescent = createScales('fluorescent');
    const step: ZoraColorScaleStep = 500;

    const neutralPrimary = parseHexToOklch(getZoraRoleColorScale(neutral, 'primary').scale[step]).c;
    const fluorescentPrimary = parseHexToOklch(
      getZoraRoleColorScale(fluorescent, 'primary').scale[step],
    ).c;

    expect(fluorescentPrimary).toBeGreaterThan(neutralPrimary);
  });

  test('pastel keeps surfaceTint lower chroma than fluorescent foreground roles', () => {
    const pastel = createScales('pastel');
    const fluorescent = createScales('fluorescent');
    const step: ZoraColorScaleStep = 500;

    const pastelSurfaceTint = parseHexToOklch(
      getZoraRoleColorScale(pastel, 'surfaceTint').scale[step],
    ).c;
    const fluorescentAccent = parseHexToOklch(
      getZoraRoleColorScale(fluorescent, 'accent').scale[step],
    ).c;

    expect(pastelSurfaceTint).toBeLessThan(fluorescentAccent);
  });

  test('neutral scale has low chroma', () => {
    const neutral = getZoraRoleColorScale(createScales(), 'neutral').scale;

    for (const { hex } of getStepValues(neutral)) {
      expect(parseHexToOklch(hex).c).toBeLessThanOrEqual(0.03);
    }
  });

  test('missing required hue role throws a clear error', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    expect(() =>
      createZoraRoleColorScales({ colorTone: 'jewel', hueRoles, seed: '#0f766e' }),
    ).toThrow('highlight');
  });

  test('no role scale contains pure black/white by default', () => {
    const scales = createScales();

    for (const role of scales.roles) {
      assertNoPureBlackOrWhite(role.scale);
    }
  });

  test('does not mutate input hueRoles', () => {
    const hueRoles = createCompleteHueRoles();
    const snapshot = JSON.stringify(hueRoles);

    createZoraRoleColorScales({ colorTone: 'jewel', hueRoles, seed: '#0f766e' });

    expect(JSON.stringify(hueRoles)).toBe(snapshot);
  });

  test('integration: harmony -> role hues -> role scales pipeline connects', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony = computeZoraHarmony(seed, 'tetradic');
    const hueRoles = assignZoraHarmonyRoleHues(harmony);

    const scales = createZoraRoleColorScales({ colorTone: 'jewel', hueRoles, seed });

    expect(scales.roles.map((entry) => entry.role)).toEqual([...ZORA_COLOR_SCALE_ROLE_ORDER]);
    for (const role of scales.roles) {
      assertScaleKeys(role.scale);
    }
  });
});
