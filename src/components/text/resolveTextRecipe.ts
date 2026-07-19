import {
  type Breakpoint,
  type FontWeight,
  resolveResponsive,
  type Responsive,
  type RoleSemantics,
  type SurfaceTheme,
} from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type { TextAlign, TextColor, TextEmphasis, TextVariant, TextWeight } from './types';

interface VariantRecipe {
  fontSize: number;
  lineHeight: number;
  weight: TextWeight;
  textTransform?: TextStyle['textTransform'];
  letterSpacing?: number;
}

interface ResolveTextStyleOptions {
  theme: SurfaceTheme;
  breakpoint: Breakpoint;
  variant?: Responsive<TextVariant>;
  color?: Responsive<TextColor>;
  emphasis?: Responsive<TextEmphasis>;
  weight?: Responsive<TextWeight>;
  align?: Responsive<TextAlign>;
  italic?: boolean;
}

function isMediumBreakpointOrLarger(breakpoint: Breakpoint): boolean {
  return breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl';
}

function resolveWeight(theme: SurfaceTheme, weight: TextWeight): FontWeight {
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

function resolveFontFamily({
  theme,
  variant,
  weight,
  italic,
}: {
  theme: SurfaceTheme;
  variant: TextVariant;
  weight: FontWeight;
  italic: boolean;
}): string | undefined {
  if (variant === 'code') {
    return 'monospace';
  }

  const fonts = italic ? theme.typography.fonts.italic : theme.typography.fonts.normal;

  for (const [fontWeight, fontFamily] of Object.entries(fonts)) {
    if (fontWeight === weight) {
      return fontFamily;
    }
  }

  return undefined;
}

function resolveVariantRecipe(
  theme: SurfaceTheme,
  variant: TextVariant,
  breakpoint: Breakpoint,
): VariantRecipe {
  switch (variant) {
    case 'lead':
      return {
        fontSize: isMediumBreakpointOrLarger(breakpoint)
          ? theme.typography.sizes.l
          : theme.typography.sizes.m,
        lineHeight: isMediumBreakpointOrLarger(breakpoint) ? 28 : 24,
        weight: 'regular',
      };
    case 'bodySmall':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 20,
        weight: 'regular',
      };
    case 'caption':
      return {
        fontSize: theme.typography.sizes.xs,
        lineHeight: 16,
        weight: 'regular',
      };
    case 'label':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 18,
        weight: 'medium',
      };
    case 'eyebrow':
      return {
        fontSize: theme.typography.sizes.xs,
        lineHeight: 16,
        weight: 'semiBold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
      };
    case 'code':
      return {
        fontSize: theme.typography.sizes.s,
        lineHeight: 20,
        weight: 'regular',
      };
    case 'body':
    default:
      return {
        fontSize: theme.typography.sizes.m,
        lineHeight: 24,
        weight: 'regular',
      };
  }
}

function resolveRoleSemantics(theme: SurfaceTheme, color: TextColor): RoleSemantics {
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

function resolveTextColor(theme: SurfaceTheme, emphasis: TextEmphasis, color?: TextColor): string {
  if (color) {
    const role = resolveRoleSemantics(theme, color);
    return emphasis === 'inverse' ? role.onSolidText : role.base;
  }

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

export function resolveTextStyle({
  theme,
  breakpoint,
  variant,
  color,
  emphasis,
  weight,
  align,
  italic = false,
}: ResolveTextStyleOptions): TextStyle {
  const resolvedVariant = resolveResponsive(variant, breakpoint) ?? 'body';
  const resolvedEmphasis = resolveResponsive(emphasis, breakpoint) ?? 'default';
  const resolvedColor = resolveResponsive(color, breakpoint);
  const resolvedAlign = resolveResponsive(align, breakpoint);
  const recipe = resolveVariantRecipe(theme, resolvedVariant, breakpoint);
  const resolvedWeight = resolveWeight(
    theme,
    resolveResponsive(weight, breakpoint) ?? recipe.weight,
  );

  return {
    color: resolveTextColor(theme, resolvedEmphasis, resolvedColor),
    elevation: 0,
    fontFamily: resolveFontFamily({
      theme,
      variant: resolvedVariant,
      weight: resolvedWeight,
      italic,
    }),
    fontSize: recipe.fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: resolvedWeight,
    letterSpacing: recipe.letterSpacing,
    lineHeight: recipe.lineHeight,
    textAlign: resolvedAlign,
    textTransform: recipe.textTransform,
  };
}
