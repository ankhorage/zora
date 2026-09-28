import {
  getReadableForeground,
  parseHexColor as parseCanonicalHexColor,
} from '@ankhorage/color-theory';

import type { TabletopColorOverrides, TabletopColorScheme } from '../../../types/tabletop';

interface TabletopColorThemeShape {
  semantics: {
    action: {
      primary: {
        base: string;
        softBg: string;
      };
    };
    content: {
      default: string;
      muted: string;
    };
    neutral: {
      border: string;
      divider: string;
      surface: string;
      surfaceHover: string;
    };
    warning: {
      base: string;
      softBg: string;
    };
  };
}

interface RgbColor {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
}

const MINIMUM_READABLE_CONTRAST = 4.5;

/***
 * Creates the theme-derived color palette used by tabletop primitives.
 *
 * Use `createTabletopColorScheme` when custom components need to align with the
 * same card, table, seat, token, and contrast-aware foreground colors as the
 * built-in tabletop components.
 *
 */
export function createTabletopColorScheme(
  theme: TabletopColorThemeShape,
  overrides: TabletopColorOverrides = {},
): TabletopColorScheme {
  const cardSurface = overrides.cardSurface ?? theme.semantics.neutral.surface;
  const seatSurface = overrides.seatSurface ?? theme.semantics.neutral.surface;
  const tableFelt = overrides.tableFelt ?? theme.semantics.action.primary.softBg;
  const tokenSurface = overrides.tokenSurface ?? theme.semantics.warning.softBg;

  const cardText =
    overrides.cardText ??
    resolveReadableTextColor(
      cardSurface,
      theme.semantics.content.default,
      theme.semantics.content.muted,
    );
  const seatText =
    overrides.seatText ??
    resolveReadableTextColor(
      seatSurface,
      theme.semantics.content.default,
      theme.semantics.content.muted,
    );
  const tableText =
    overrides.tableText ??
    resolveReadableTextColor(
      tableFelt,
      theme.semantics.content.default,
      theme.semantics.content.muted,
    );
  const tokenText =
    overrides.tokenText ??
    resolveReadableTextColor(
      tokenSurface,
      theme.semantics.content.default,
      theme.semantics.content.muted,
    );

  return {
    cardBack: overrides.cardBack ?? theme.semantics.warning.base,
    cardBackBorder: overrides.cardBackBorder ?? theme.semantics.neutral.border,
    cardBorder: overrides.cardBorder ?? theme.semantics.neutral.border,
    cardSurface,
    cardText,
    mutedText:
      overrides.mutedText ??
      resolveReadableTextColor(cardSurface, theme.semantics.content.muted, cardText),
    redSuitText:
      overrides.redSuitText ??
      resolveReadableTextColor(cardSurface, theme.semantics.warning.base, cardText),
    seatBorder: overrides.seatBorder ?? theme.semantics.neutral.divider,
    seatMutedText:
      overrides.seatMutedText ??
      resolveReadableTextColor(seatSurface, theme.semantics.content.muted, seatText),
    seatSelectedBorder: overrides.seatSelectedBorder ?? theme.semantics.action.primary.base,
    seatSurface,
    seatText,
    tableBorder: overrides.tableBorder ?? theme.semantics.warning.base,
    tableFelt,
    tableInnerBorder: overrides.tableInnerBorder ?? theme.semantics.neutral.divider,
    tableMutedText:
      overrides.tableMutedText ??
      resolveReadableTextColor(tableFelt, theme.semantics.content.muted, tableText),
    tableText,
    tokenSurface,
    tokenText,
  };
}

/*** Chooses the most legible supplied foreground for a themed surface. */
function resolveReadableTextColor(background: string, preferred: string, fallback: string): string {
  const preferredContrast = getContrastRatio(background, preferred);
  if (preferredContrast !== null && preferredContrast >= MINIMUM_READABLE_CONTRAST) {
    return preferred;
  }

  const parsedBackground = parseHexColor(background);
  const normalizedBackground =
    parsedBackground === null ? null : parseCanonicalHexColor(toHexColor(parsedBackground));
  const strongestForeground =
    normalizedBackground === null
      ? undefined
      : getReadableForeground(normalizedBackground).foreground;
  const candidates = uniqueColors([
    preferred,
    fallback,
    ...(strongestForeground === undefined ? [] : [strongestForeground]),
  ]);
  const [readableCandidate] = candidates
    .map((candidate) => ({ candidate, contrast: getContrastRatio(background, candidate) }))
    .filter(
      (entry): entry is { readonly candidate: string; readonly contrast: number } =>
        entry.contrast !== null,
    )
    .sort((left, right) => right.contrast - left.contrast);

  return readableCandidate?.candidate ?? preferred;
}

/*** Converts a parsed color to Color Theory's canonical six-digit input. */
function toHexColor(color: RgbColor): string {
  return `#${[color.red, color.green, color.blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/*** Removes duplicate contrast candidates without changing their order. */
function uniqueColors(colors: readonly string[]): string[] {
  return [...new Set(colors)];
}

/*** Measures contrast when both colors can be parsed as hex. */
function getContrastRatio(background: string, foreground: string): number | null {
  const backgroundColor = parseHexColor(background);
  const foregroundColor = parseHexColor(foreground);

  if (backgroundColor === null || foregroundColor === null) return null;

  const backgroundLuminance = getRelativeLuminance(backgroundColor);
  const foregroundLuminance = getRelativeLuminance(foregroundColor);
  const lighter = Math.max(backgroundLuminance, foregroundLuminance);
  const darker = Math.min(backgroundLuminance, foregroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/*** Parses the hex colors supported by the tabletop palette. */
function parseHexColor(color: string): RgbColor | null {
  const value = color.trim();
  const hex = value.startsWith('#') ? value.slice(1) : '';
  if (!isSupportedHexLength(hex) || !isHexColorValue(hex)) return null;

  if (hex.length === 3) {
    const red = hex.slice(0, 1);
    const green = hex.slice(1, 2);
    const blue = hex.slice(2, 3);

    return {
      red: parseInt(red + red, 16),
      green: parseInt(green + green, 16),
      blue: parseInt(blue + blue, 16),
    };
  }

  return {
    red: parseInt(hex.slice(0, 2), 16),
    green: parseInt(hex.slice(2, 4), 16),
    blue: parseInt(hex.slice(4, 6), 16),
  };
}

/*** Checks the supported short, full, and alpha hex lengths. */
function isSupportedHexLength(hex: string): boolean {
  return hex.length === 3 || hex.length === 6 || hex.length === 8;
}

/*** Rejects non-hexadecimal color digits. */
function isHexColorValue(hex: string): boolean {
  return [...hex].every((character) => isHexCharacter(character));
}

/*** Checks whether a character is a hexadecimal digit. */
function isHexCharacter(character: string): boolean {
  const code = character.charCodeAt(0);
  const isDigit = code >= 48 && code <= 57;
  const isUpperHex = code >= 65 && code <= 70;
  const isLowerHex = code >= 97 && code <= 102;

  return isDigit || isUpperHex || isLowerHex;
}

/*** Computes relative luminance for one RGB color. */
function getRelativeLuminance(color: RgbColor): number {
  const red = normalizeColorChannel(color.red);
  const green = normalizeColorChannel(color.green);
  const blue = normalizeColorChannel(color.blue);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/*** Converts an RGB channel into linear light. */
function normalizeColorChannel(value: number): number {
  const normalized = value / 255;
  if (normalized <= 0.03928) return normalized / 12.92;
  return ((normalized + 0.055) / 1.055) ** 2.4;
}
