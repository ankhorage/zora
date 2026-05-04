import { converter, formatHex, parse, toGamut } from 'culori';

import type { ZoraHexColor } from '../../theme/types';
import type { ZoraOklchColor } from './types';

const toOklch = converter('oklch');
const gamutMapToSrgb = toGamut('rgb', 'oklch');

function normalizeHueDegrees(hue: number): number {
  const normalized = ((hue % 360) + 360) % 360;
  return normalized;
}

function isSixDigitHexColor(value: string): value is ZoraHexColor {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function parseHexToOklch(hex: ZoraHexColor): ZoraOklchColor {
  if (!isSixDigitHexColor(hex)) {
    throw new Error(`Expected a 6-digit hex color like '#0f766e', got '${String(hex)}'.`);
  }

  const parsed = parse(hex);
  if (!parsed) {
    throw new Error(`Unable to parse hex color '${String(hex)}'.`);
  }

  const oklch = toOklch(parsed);
  if (typeof oklch.l !== 'number' || typeof oklch.c !== 'number') {
    throw new Error(`Unable to convert hex color '${String(hex)}' to OKLCH.`);
  }

  return {
    l: oklch.l,
    c: oklch.c,
    h: normalizeHueDegrees(typeof oklch.h === 'number' ? oklch.h : 0),
  };
}

export function formatOklchAsHex(color: ZoraOklchColor): ZoraHexColor {
  const mapped = gamutMapToSrgb({ mode: 'oklch', l: color.l, c: color.c, h: color.h });
  const hex = formatHex(mapped);

  if (!hex || !isSixDigitHexColor(hex)) {
    throw new Error('Unable to format OKLCH color as a 6-digit hex value.');
  }

  const normalized = hex.toLowerCase();
  if (!isSixDigitHexColor(normalized)) {
    throw new Error('Unable to format OKLCH color as a 6-digit hex value.');
  }

  return normalized;
}

export function clampOklchToGamut(color: ZoraOklchColor): ZoraOklchColor {
  const mapped = gamutMapToSrgb({ mode: 'oklch', l: color.l, c: color.c, h: color.h });
  const clamped = toOklch(mapped);

  if (typeof clamped.l !== 'number' || typeof clamped.c !== 'number') {
    throw new Error('Unable to clamp OKLCH color to sRGB gamut.');
  }

  return {
    l: clamped.l,
    c: clamped.c,
    h: normalizeHueDegrees(typeof clamped.h === 'number' ? clamped.h : 0),
  };
}
