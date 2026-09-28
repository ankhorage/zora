import type { OpeningBookColorOverrides, OpeningBookColorScheme } from '../../../types/chess';
import type { ChessColorThemeShape } from './createChessBoardColorScheme';

/***
 * Creates the theme-derived palette used by `OpeningBook`.
 *
 * Use `createOpeningBookColorScheme` when custom opening-list rows, badges, or
 * trainer panels should match the built-in book surface and selected-move states.
 *
 */
export function createOpeningBookColorScheme(
  theme: ChessColorThemeShape,
  overrides?: OpeningBookColorOverrides,
): OpeningBookColorScheme {
  return {
    border: theme.semantics.neutral.divider,
    metricSurface: theme.semantics.neutral.surface,
    primaryText: theme.semantics.content.default,
    secondaryText: theme.semantics.content.muted,
    selectedSurface: theme.semantics.action.primary.softBg,
    surface: theme.semantics.neutral.surface,
    surfaceHover: theme.semantics.neutral.surfaceHover,
    titleText: theme.semantics.content.default,
    ...overrides,
  };
}
