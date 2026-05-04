import { describe, expect, test } from 'bun:test';

import type { ZoraHexColor } from '../../theme/types';
import {
  assignZoraHarmonyRoleHues,
  computeZoraHarmony,
  createZoraRoleColorScales,
  getZoraRoleColorScale,
  parseHexToOklch,
  ZORA_COLOR_SCALE_ROLE_ORDER,
  ZORA_COLOR_SCALE_STEPS,
  type ZoraColorScale,
  type ZoraColorScaleRoleId,
  type ZoraColorScaleStep,
  type ZoraComputedHueRoles,
  type ZoraComputedRoleColorScales,
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

function requireHueBackedSourceHue(role: ZoraRoleColorScale): number {
  if (typeof role.sourceHue !== 'number') {
    throw new Error(`[zora] Expected "${role.role}" role scale to include a sourceHue.`);
  }
  return role.sourceHue;
}

function expectRoleOrder(
  scales: ZoraComputedRoleColorScales,
  expected: readonly ZoraColorScaleRoleId[],
) {
  expect(scales.roles.map((entry) => entry.role)).toEqual([...expected]);
}

describe('createZoraRoleColorScales', () => {
  test('returns all roles exactly once in deterministic order', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const scales: ZoraComputedRoleColorScales = createZoraRoleColorScales({
      hueRoles,
      seed: '#0f766e',
    });

    const expectedOrder: readonly ZoraColorScaleRoleId[] = ZORA_COLOR_SCALE_ROLE_ORDER;
    expect(scales.roles).toHaveLength(expectedOrder.length);

    expectRoleOrder(scales, expectedOrder);
    expect(new Set(scales.roles.map((entry) => entry.role)).size).toBe(
      ZORA_COLOR_SCALE_ROLE_ORDER.length,
    );
  });

  test('every scale contains exactly all 50–950 keys and valid lowercase 6-digit hex values', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const scales = createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });

    for (const role of scales.roles) {
      assertScaleKeys(role.scale);
      for (const { hex } of getStepValues(role.scale)) {
        expect(isSixDigitLowercaseHexColor(hex)).toBe(true);
      }
    }
  });

  test('output is deterministic for the same input', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const seed: ZoraHexColor = '#0f766e';

    expect(createZoraRoleColorScales({ hueRoles, seed })).toEqual(
      createZoraRoleColorScales({ hueRoles, seed }),
    );
  });

  test('role hue is preserved approximately for mid steps', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 115, sourceSlotId: 'base' },
      { role: 'secondary', hue: 210, sourceSlotId: 'a' },
      { role: 'accent', hue: 300, sourceSlotId: 'b' },
      { role: 'highlight', hue: 25, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 165, sourceSlotId: 'a' },
    ]);

    const scales = createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });

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
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const scales = createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });

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

  test('neutral scale has low chroma', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const scales = createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });
    const neutral = getZoraRoleColorScale(scales, 'neutral').scale;

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

    expect(() => createZoraRoleColorScales({ hueRoles, seed: '#0f766e' })).toThrow('highlight');
  });

  test('no role scale contains pure black/white by default', () => {
    const hueRoles = buildHueRoles([
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ]);

    const scales = createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });

    for (const role of scales.roles) {
      assertNoPureBlackOrWhite(role.scale);
    }
  });

  test('does not mutate input hueRoles', () => {
    const assignments: ZoraComputedHueRoles['assignments'] = [
      { role: 'primary', hue: 120, sourceSlotId: 'base' },
      { role: 'secondary', hue: 200, sourceSlotId: 'a' },
      { role: 'accent', hue: 280, sourceSlotId: 'b' },
      { role: 'highlight', hue: 20, sourceSlotId: 'c' },
      { role: 'surfaceTint', hue: 160, sourceSlotId: 'a' },
    ];

    const hueRoles: ZoraComputedHueRoles = buildHueRoles(assignments);
    const snapshot = JSON.stringify(hueRoles);

    createZoraRoleColorScales({ hueRoles, seed: '#0f766e' });

    expect(JSON.stringify(hueRoles)).toBe(snapshot);
  });

  test('integration: harmony -> role hues -> role scales pipeline connects', () => {
    const seed: ZoraHexColor = '#0f766e';
    const harmony = computeZoraHarmony(seed, 'tetradic');
    const hueRoles = assignZoraHarmonyRoleHues(harmony);

    const scales = createZoraRoleColorScales({ hueRoles, seed });

    expect(scales.roles.map((entry) => entry.role)).toEqual([...ZORA_COLOR_SCALE_ROLE_ORDER]);
    for (const role of scales.roles) {
      assertScaleKeys(role.scale);
    }
  });
});
