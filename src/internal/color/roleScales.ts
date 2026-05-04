import type { ZoraHexColor } from '../../theme/types';
import { parseHexToOklch } from './oklch';
import {
  getZoraHueRoleAssignment,
  type ZoraComputedHueRoles,
  type ZoraHueRoleId,
} from './roleHues';
import {
  createZoraHueScale,
  type CreateZoraHueScaleOptions,
  createZoraNeutralScale,
  type ZoraHueScaleRoleId,
} from './scales';
import type { ZoraColorScale } from './types';

export type ZoraColorScaleRoleId =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'highlight'
  | 'surfaceTint'
  | 'neutral';

export const ZORA_COLOR_SCALE_ROLE_ORDER: readonly ZoraColorScaleRoleId[] = [
  'primary',
  'secondary',
  'accent',
  'highlight',
  'surfaceTint',
  'neutral',
];

export interface ZoraRoleColorScale {
  role: ZoraColorScaleRoleId;
  sourceHue?: number;
  scale: ZoraColorScale;
}

export interface ZoraComputedRoleColorScales {
  roles: readonly ZoraRoleColorScale[];
}

export function getZoraRoleColorScale(
  scales: ZoraComputedRoleColorScales,
  role: ZoraColorScaleRoleId,
): ZoraRoleColorScale {
  const found = scales.roles.find((entry) => entry.role === role);
  if (!found) {
    throw new Error(`[zora] Expected role color scales to include "${role}".`);
  }
  return found;
}

function resolveSeedChroma(seed: ZoraHexColor): number {
  return parseHexToOklch(seed).c;
}

function createHueBackedRoleScale(options: {
  hueRoles: ZoraComputedHueRoles;
  seedChroma: number;
  role: ZoraHueRoleId;
}): ZoraRoleColorScale {
  const assignment = getZoraHueRoleAssignment(options.hueRoles, options.role);
  const hueScaleRole: ZoraHueScaleRoleId = options.role;
  const hueScaleOptions: CreateZoraHueScaleOptions = {
    hue: assignment.hue,
    seedChroma: options.seedChroma,
    role: hueScaleRole,
  };

  return {
    role: options.role,
    sourceHue: assignment.hue,
    scale: createZoraHueScale(hueScaleOptions),
  };
}

export function createZoraRoleColorScales(options: {
  hueRoles: ZoraComputedHueRoles;
  seed: ZoraHexColor;
}): ZoraComputedRoleColorScales {
  const seedChroma = resolveSeedChroma(options.seed);

  const roles: ZoraRoleColorScale[] = [
    createHueBackedRoleScale({ hueRoles: options.hueRoles, seedChroma, role: 'primary' }),
    createHueBackedRoleScale({ hueRoles: options.hueRoles, seedChroma, role: 'secondary' }),
    createHueBackedRoleScale({ hueRoles: options.hueRoles, seedChroma, role: 'accent' }),
    createHueBackedRoleScale({ hueRoles: options.hueRoles, seedChroma, role: 'highlight' }),
    createHueBackedRoleScale({ hueRoles: options.hueRoles, seedChroma, role: 'surfaceTint' }),
    {
      role: 'neutral',
      scale: createZoraNeutralScale(options.seed),
    },
  ];

  return { roles };
}
