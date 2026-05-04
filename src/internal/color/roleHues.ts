import type { ZoraColorHarmony } from '../../theme/types';
import type { ZoraComputedHarmony, ZoraHarmonySlot, ZoraHarmonySlotId } from './harmony';
import { normalizeHueDegrees } from './hue';

export type ZoraHueRoleId = 'primary' | 'secondary' | 'accent' | 'highlight' | 'surfaceTint';

export interface ZoraHueRoleAssignment {
  role: ZoraHueRoleId;
  hue: number;
  sourceSlotId: ZoraHarmonySlotId;
}

export interface ZoraComputedHueRoles {
  harmony: ZoraColorHarmony;
  assignments: readonly ZoraHueRoleAssignment[];
}

function findSlot(
  harmony: ZoraComputedHarmony,
  id: ZoraHarmonySlotId,
): ZoraHarmonySlot | undefined {
  return harmony.orderedSlots.find((slot) => slot.id === id);
}

function requireBaseSlot(harmony: ZoraComputedHarmony): ZoraHarmonySlot {
  const base = findSlot(harmony, 'base');
  if (!base) {
    throw new Error(`[zora] Expected harmony to include a base slot (kind: ${harmony.kind}).`);
  }
  return base;
}

function assignRole(
  role: ZoraHueRoleId,
  harmony: ZoraComputedHarmony,
  preferred: ZoraHarmonySlotId,
  fallback: ZoraHarmonySlotId = 'base',
): ZoraHueRoleAssignment {
  const base = requireBaseSlot(harmony);
  const preferredSlot = findSlot(harmony, preferred);
  const fallbackSlot = findSlot(harmony, fallback);
  const chosenSlot = preferredSlot ?? fallbackSlot ?? base;

  return {
    role,
    hue: normalizeHueDegrees(chosenSlot.hue),
    sourceSlotId: chosenSlot.id,
  };
}

export function assignZoraHarmonyRoleHues(harmony: ZoraComputedHarmony): ZoraComputedHueRoles {
  const { kind } = harmony;

  if (kind === 'monochromatic') {
    return {
      harmony: kind,
      assignments: [
        assignRole('primary', harmony, 'base'),
        assignRole('secondary', harmony, 'base'),
        assignRole('accent', harmony, 'base'),
        assignRole('highlight', harmony, 'base'),
        assignRole('surfaceTint', harmony, 'base'),
      ],
    };
  }

  if (kind === 'complementary') {
    return {
      harmony: kind,
      assignments: [
        assignRole('primary', harmony, 'base'),
        assignRole('secondary', harmony, 'base'),
        assignRole('accent', harmony, 'a'),
        assignRole('highlight', harmony, 'a'),
        assignRole('surfaceTint', harmony, 'base'),
      ],
    };
  }

  if (kind === 'analogous') {
    return {
      harmony: kind,
      assignments: [
        assignRole('primary', harmony, 'base'),
        assignRole('secondary', harmony, 'a'),
        assignRole('accent', harmony, 'b', 'a'),
        assignRole('highlight', harmony, 'b', 'a'),
        assignRole('surfaceTint', harmony, 'a'),
      ],
    };
  }

  if (kind === 'splitComplementary') {
    return {
      harmony: kind,
      assignments: [
        assignRole('primary', harmony, 'base'),
        assignRole('secondary', harmony, 'a'),
        assignRole('accent', harmony, 'b', 'a'),
        assignRole('highlight', harmony, 'b', 'a'),
        assignRole('surfaceTint', harmony, 'base'),
      ],
    };
  }

  if (kind === 'triadic') {
    return {
      harmony: kind,
      assignments: [
        assignRole('primary', harmony, 'base'),
        assignRole('secondary', harmony, 'a'),
        assignRole('accent', harmony, 'b', 'a'),
        assignRole('highlight', harmony, 'b', 'a'),
        assignRole('surfaceTint', harmony, 'base'),
      ],
    };
  }

  return {
    harmony: kind,
    assignments: [
      assignRole('primary', harmony, 'base'),
      assignRole('secondary', harmony, 'a'),
      assignRole('accent', harmony, 'b', 'a'),
      assignRole('highlight', harmony, 'c', 'b'),
      assignRole('surfaceTint', harmony, 'base'),
    ],
  };
}

export function getZoraHueRoleAssignment(
  roles: ZoraComputedHueRoles,
  role: ZoraHueRoleId,
): ZoraHueRoleAssignment {
  const found = roles.assignments.find((assignment) => assignment.role === role);
  if (!found) {
    throw new Error(
      `[zora] Expected a hue-role assignment for "${role}" (harmony: ${roles.harmony}).`,
    );
  }
  return found;
}
