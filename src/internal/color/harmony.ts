import type { ZoraColorHarmony, ZoraHexColor } from '../../theme/types';
import { normalizeHueDegrees, rotateHueDegrees } from './hue';
import { parseHexToOklch } from './oklch';

export type ZoraHarmonySlotId = 'base' | 'a' | 'b' | 'c';

export interface ZoraHarmonySlot {
  id: ZoraHarmonySlotId;
  hue: number;
}

export interface ZoraComputedHarmony {
  kind: ZoraColorHarmony;
  orderedSlots: readonly ZoraHarmonySlot[];
}

const DEFAULT_HARMONY_HUE_DEGREES = 260;
const MIN_SEED_CHROMA_FOR_HARMONY_HUE = 0.03;

function createSlot(id: ZoraHarmonySlotId, hue: number): ZoraHarmonySlot {
  return { id, hue: normalizeHueDegrees(hue) };
}

function resolveSeedHueDegrees(seed: ZoraHexColor): number {
  const parsed = parseHexToOklch(seed);

  if (!Number.isFinite(parsed.h) || parsed.c < MIN_SEED_CHROMA_FOR_HARMONY_HUE) {
    return DEFAULT_HARMONY_HUE_DEGREES;
  }

  return normalizeHueDegrees(parsed.h);
}

export function computeZoraHarmony(
  seed: ZoraHexColor,
  harmony: ZoraColorHarmony,
): ZoraComputedHarmony {
  const baseHue = resolveSeedHueDegrees(seed);

  if (harmony === 'monochromatic') {
    return {
      kind: harmony,
      orderedSlots: [createSlot('base', baseHue)],
    };
  }

  if (harmony === 'complementary') {
    return {
      kind: harmony,
      orderedSlots: [createSlot('base', baseHue), createSlot('a', rotateHueDegrees(baseHue, 180))],
    };
  }

  if (harmony === 'analogous') {
    return {
      kind: harmony,
      orderedSlots: [
        createSlot('base', baseHue),
        createSlot('a', rotateHueDegrees(baseHue, -30)),
        createSlot('b', rotateHueDegrees(baseHue, 30)),
      ],
    };
  }

  if (harmony === 'splitComplementary') {
    return {
      kind: harmony,
      orderedSlots: [
        createSlot('base', baseHue),
        createSlot('a', rotateHueDegrees(baseHue, 150)),
        createSlot('b', rotateHueDegrees(baseHue, 210)),
      ],
    };
  }

  if (harmony === 'triadic') {
    return {
      kind: harmony,
      orderedSlots: [
        createSlot('base', baseHue),
        createSlot('a', rotateHueDegrees(baseHue, 120)),
        createSlot('b', rotateHueDegrees(baseHue, 240)),
      ],
    };
  }

  return {
    kind: harmony,
    orderedSlots: [
      createSlot('base', baseHue),
      createSlot('a', rotateHueDegrees(baseHue, 90)),
      createSlot('b', rotateHueDegrees(baseHue, 180)),
      createSlot('c', rotateHueDegrees(baseHue, 270)),
    ],
  };
}
