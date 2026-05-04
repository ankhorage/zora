import { describe, expect, test } from 'bun:test';

import {
  assignZoraHarmonyRoleHues,
  getZoraHueRoleAssignment,
  type ZoraComputedHarmony,
  type ZoraComputedHueRoles,
  type ZoraHueRoleAssignment,
  type ZoraHueRoleId,
} from './index';

function expectNormalizedHue(hue: number) {
  expect(Number.isFinite(hue)).toBe(true);
  expect(hue).toBeGreaterThanOrEqual(0);
  expect(hue).toBeLessThan(360);
}

const ROLE_ORDER: readonly ZoraHueRoleId[] = [
  'primary',
  'secondary',
  'accent',
  'highlight',
  'surfaceTint',
];

function expectEveryRoleOnce(roles: ReturnType<typeof assignZoraHarmonyRoleHues>) {
  expect(roles.assignments).toHaveLength(ROLE_ORDER.length);
  expect(roles.assignments.map((assignment) => assignment.role)).toEqual(ROLE_ORDER);
}

describe('assignZoraHarmonyRoleHues', () => {
  test('monochromatic assigns every role to base', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'monochromatic',
      orderedSlots: [{ id: 'base', hue: 100 }],
    };

    const roles: ZoraComputedHueRoles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    for (const assignment of roles.assignments) {
      expect(assignment.sourceSlotId).toBe('base');
      expect(assignment.hue).toBe(100);
      expectNormalizedHue(assignment.hue);
    }
  });

  test('complementary assigns accent/highlight to a', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'complementary',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 280 },
      ],
    };

    const roles: ZoraComputedHueRoles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    const accent: ZoraHueRoleAssignment = getZoraHueRoleAssignment(roles, 'accent');
    const highlight: ZoraHueRoleAssignment = getZoraHueRoleAssignment(roles, 'highlight');

    expect(accent.sourceSlotId).toBe('a');
    expect(highlight.sourceSlotId).toBe('a');
    expect(getZoraHueRoleAssignment(roles, 'primary').sourceSlotId).toBe('base');
    expect(getZoraHueRoleAssignment(roles, 'surfaceTint').sourceSlotId).toBe('base');
  });

  test('analogous assigns secondary/surfaceTint to a and accent/highlight to b', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'analogous',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 70 },
        { id: 'b', hue: 130 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    expect(getZoraHueRoleAssignment(roles, 'secondary').sourceSlotId).toBe('a');
    expect(getZoraHueRoleAssignment(roles, 'surfaceTint').sourceSlotId).toBe('a');
    expect(getZoraHueRoleAssignment(roles, 'accent').sourceSlotId).toBe('b');
    expect(getZoraHueRoleAssignment(roles, 'highlight').sourceSlotId).toBe('b');
  });

  test('splitComplementary assigns primary/surfaceTint to base and accent/highlight to b', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'splitComplementary',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 250 },
        { id: 'b', hue: 310 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    expect(getZoraHueRoleAssignment(roles, 'primary').sourceSlotId).toBe('base');
    expect(getZoraHueRoleAssignment(roles, 'surfaceTint').sourceSlotId).toBe('base');
    expect(getZoraHueRoleAssignment(roles, 'accent').sourceSlotId).toBe('b');
    expect(getZoraHueRoleAssignment(roles, 'highlight').sourceSlotId).toBe('b');
  });

  test('triadic assigns primary/surfaceTint to base and secondary/accent across a/b', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'triadic',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 220 },
        { id: 'b', hue: 340 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    expect(getZoraHueRoleAssignment(roles, 'primary').sourceSlotId).toBe('base');
    expect(getZoraHueRoleAssignment(roles, 'surfaceTint').sourceSlotId).toBe('base');
    expect(getZoraHueRoleAssignment(roles, 'secondary').sourceSlotId).toBe('a');
    expect(getZoraHueRoleAssignment(roles, 'accent').sourceSlotId).toBe('b');
  });

  test('tetradic assigns highlight to c', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'tetradic',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 190 },
        { id: 'b', hue: 280 },
        { id: 'c', hue: 10 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    expect(getZoraHueRoleAssignment(roles, 'highlight').sourceSlotId).toBe('c');
  });

  test('every assignment hue is normalized to [0, 360)', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'complementary',
      orderedSlots: [
        { id: 'base', hue: -10 },
        { id: 'a', hue: 370 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    for (const assignment of roles.assignments) {
      expectNormalizedHue(assignment.hue);
    }
  });

  test('is deterministic for the same computed harmony', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'analogous',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 70 },
        { id: 'b', hue: 130 },
      ],
    };

    expect(assignZoraHarmonyRoleHues(harmony)).toEqual(assignZoraHarmonyRoleHues(harmony));
  });

  test('falls back when a preferred non-base slot is missing', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'analogous',
      orderedSlots: [
        { id: 'base', hue: 100 },
        { id: 'a', hue: 70 },
      ],
    };

    const roles = assignZoraHarmonyRoleHues(harmony);

    expectEveryRoleOnce(roles);
    expect(getZoraHueRoleAssignment(roles, 'accent').sourceSlotId).toBe('a');
    expect(getZoraHueRoleAssignment(roles, 'highlight').sourceSlotId).toBe('a');
  });

  test('throws a clear error when the base slot is missing', () => {
    const harmony: ZoraComputedHarmony = {
      kind: 'complementary',
      orderedSlots: [{ id: 'a', hue: 200 }],
    };

    expect(() => assignZoraHarmonyRoleHues(harmony)).toThrow('base');
  });
});
