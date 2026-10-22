import type { FontWeight, RoleSemantics, SurfaceTheme } from '@ankhorage/surface';

import type { HeadingColor, HeadingEmphasis, HeadingWeight } from '../../../types/heading';
import type { TextColor, TextEmphasis, TextWeight } from '../../../types/text';

/*** Resolves the Surface-derived style tokens shared by Heading and Text. */
export function resolveTypographyStyleTokens({
  theme,
  color,
  emphasis,
  weight,
  italic,
}: ResolveTypographyStyleTokensInput): ResolveTypographyStyleTokensOutput {
  const role = color ? resolveRoleSemantics(theme, color) : undefined;
  const fontWeight = resolveWeight(theme, weight);

  return {
    color: role
      ? emphasis === 'inverse'
        ? role.onSolidText
        : role.base
      : resolveEmphasisColor(theme, emphasis),
    fontFamily: resolveFontFamily(theme, fontWeight, italic),
    fontWeight,
  };
}

interface ResolveTypographyStyleTokensInput {
  readonly theme: SurfaceTheme;
  readonly color: TypographyColor | undefined;
  readonly emphasis: TypographyEmphasis;
  readonly weight: TypographyWeight;
  readonly italic: boolean;
}

interface ResolveTypographyStyleTokensOutput {
  readonly color: string;
  readonly fontFamily: string | undefined;
  readonly fontWeight: FontWeight;
}

type TypographyColor = HeadingColor | TextColor;
type TypographyEmphasis = HeadingEmphasis | TextEmphasis;
type TypographyWeight = HeadingWeight | TextWeight;

function resolveRoleSemantics(theme: SurfaceTheme, color: TypographyColor): RoleSemantics {
  switch (color) {
    case 'secondary':
      return theme.semantics.secondary;
    case 'tertiary':
      return theme.semantics.accent;
    case 'quaternary':
      return theme.semantics.highlight;
    case 'neutral':
      return theme.semantics.action.neutral;
    case 'error':
      return theme.semantics.error;
    case 'info':
      return theme.semantics.info;
    case 'danger':
      return theme.semantics.action.danger;
    case 'success':
      return theme.semantics.success;
    case 'warning':
      return theme.semantics.warning;
    case 'primary':
    default:
      return theme.semantics.action.primary;
  }
}

function resolveEmphasisColor(theme: SurfaceTheme, emphasis: TypographyEmphasis): string {
  switch (emphasis) {
    case 'muted':
      return theme.semantics.content.muted;
    case 'subtle':
      return theme.semantics.content.subtle;
    case 'inverse':
      return theme.semantics.content.inverse;
    case 'default':
    default:
      return theme.semantics.content.default;
  }
}

function resolveWeight(theme: SurfaceTheme, weight: TypographyWeight): FontWeight {
  switch (weight) {
    case 'medium':
      return theme.typography.weights.medium;
    case 'semiBold':
      return theme.typography.weights.semiBold;
    case 'bold':
      return theme.typography.weights.bold;
    case 'regular':
    default:
      return theme.typography.weights.regular;
  }
}

function resolveFontFamily(
  theme: SurfaceTheme,
  weight: FontWeight,
  italic: boolean,
): string | undefined {
  const fonts = italic ? theme.typography.fonts.italic : theme.typography.fonts.normal;

  for (const [fontWeight, fontFamily] of Object.entries(fonts)) {
    if (fontWeight === weight) {
      return fontFamily;
    }
  }

  return undefined;
}
