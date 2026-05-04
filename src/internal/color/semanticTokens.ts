import type { ZoraColorTone, ZoraHexColor, ZoraThemeMode } from '../../theme/types';
import { parseHexToOklch } from './oklch';
import { getZoraRoleColorScale, type ZoraComputedRoleColorScales } from './roleScales';

export interface ZoraSemanticColorTokens {
  background: ZoraHexColor;
  surface: ZoraHexColor;
  surfaceRaised: ZoraHexColor;
  surfaceTint: ZoraHexColor;
  border: ZoraHexColor;
  text: ZoraHexColor;
  textMuted: ZoraHexColor;
  primary: ZoraHexColor;
  secondary: ZoraHexColor;
  accent: ZoraHexColor;
  highlight: ZoraHexColor;
  onPrimary: ZoraHexColor;
  onAccent: ZoraHexColor;
}

/**
 * Selects the more readable of two candidate hex colors against a given background,
 * using OKLCH lightness as a simple contrast proxy.
 */
export function getReadableTextColor(
  background: ZoraHexColor,
  candidates: readonly [ZoraHexColor, ZoraHexColor],
): ZoraHexColor {
  const bgL = parseHexToOklch(background).l;
  const [a, b] = candidates;
  const diffA = Math.abs(parseHexToOklch(a).l - bgL);
  const diffB = Math.abs(parseHexToOklch(b).l - bgL);
  return diffA >= diffB ? a : b;
}

export function createZoraSemanticColorTokens(options: {
  roleScales: ZoraComputedRoleColorScales;
  mode: ZoraThemeMode;
  colorTone: ZoraColorTone;
}): ZoraSemanticColorTokens {
  // colorTone is accepted now and reserved for future per-tone step overrides
  // (e.g. obsidian/pastel may shift surface selections differently).
  const { roleScales, mode } = options;

  const neutral = getZoraRoleColorScale(roleScales, 'neutral').scale;
  const surfaceTintScale = getZoraRoleColorScale(roleScales, 'surfaceTint').scale;
  const primaryScale = getZoraRoleColorScale(roleScales, 'primary').scale;
  const secondaryScale = getZoraRoleColorScale(roleScales, 'secondary').scale;
  const accentScale = getZoraRoleColorScale(roleScales, 'accent').scale;
  const highlightScale = getZoraRoleColorScale(roleScales, 'highlight').scale;

  if (mode === 'light') {
    const background = neutral[50];
    const surface = neutral[100];
    const surfaceRaised = neutral[50];
    const surfaceTint = surfaceTintScale[100];
    const border = neutral[200];
    const text = neutral[900];
    const textMuted = neutral[700];
    const primary = primaryScale[600];
    const secondary = secondaryScale[600];
    const accent = accentScale[600];
    const highlight = highlightScale[600];
    const onPrimary = getReadableTextColor(primary, [neutral[50], neutral[950]]);
    const onAccent = getReadableTextColor(accent, [neutral[50], neutral[950]]);

    return {
      background,
      surface,
      surfaceRaised,
      surfaceTint,
      border,
      text,
      textMuted,
      primary,
      secondary,
      accent,
      highlight,
      onPrimary,
      onAccent,
    };
  }

  // dark mode
  const background = neutral[950];
  const surface = neutral[900];
  const surfaceRaised = neutral[800];
  const surfaceTint = surfaceTintScale[900];
  const border = neutral[700];
  const text = neutral[50];
  const textMuted = neutral[300];
  const primary = primaryScale[400];
  const secondary = secondaryScale[400];
  const accent = accentScale[400];
  const highlight = highlightScale[400];
  const onPrimary = getReadableTextColor(primary, [neutral[50], neutral[950]]);
  const onAccent = getReadableTextColor(accent, [neutral[50], neutral[950]]);

  return {
    background,
    surface,
    surfaceRaised,
    surfaceTint,
    border,
    text,
    textMuted,
    primary,
    secondary,
    accent,
    highlight,
    onPrimary,
    onAccent,
  };
}
