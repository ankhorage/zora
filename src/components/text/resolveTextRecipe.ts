import {
  type Breakpoint,
  type FontWeight,
  resolveResponsive,
  type Responsive,
  type SurfaceTheme,
} from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type { TextAlign, TextColor, TextVariant, TextWeight } from './types';

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
  weight?: Responsive<TextWeight>;
  align?: Responsive<TextAlign>;
  italic?: boolean;
}

function isMediumBreakpointOrLarger(breakpoint: Breakpoint): boolean {
  return breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl';
}

function resolveWeight(theme: SurfaceTheme, weight: TextWeight): FontWeight {
  return theme.typography.weights[weight];
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

  return theme.typography.fonts[italic ? 'italic' : 'normal'][weight];
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

function resolveColorValue(theme: SurfaceTheme, color: TextColor): string {
  switch (color) {
    case 'muted':
      return theme.semantics.content.muted;
    case 'subtle':
      return theme.semantics.content.subtle;
    case 'inverse':
      return theme.semantics.content.inverse;
    case 'primary':
      return theme.semantics.brand.base;
    case 'secondary':
      return theme.semantics.secondary.base;
    case 'tertiary':
      return theme.semantics.accent.base;
    case 'quaternary':
      return theme.semantics.highlight.base;
    case 'neutral':
      return theme.semantics.content.default;
    case 'danger':
    case 'error':
      return theme.semantics.danger.base;
    case 'success':
      return theme.semantics.success.base;
    case 'warning':
      return theme.semantics.warning.base;
    case 'info':
      return theme.semantics.secondary.base;
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
  weight,
  align,
  italic = false,
}: ResolveTextStyleOptions): TextStyle {
  const resolvedVariant = resolveResponsive(variant, breakpoint) ?? 'body';
  const resolvedColor = resolveResponsive(color, breakpoint) ?? 'default';
  const resolvedAlign = resolveResponsive(align, breakpoint);
  const recipe = resolveVariantRecipe(theme, resolvedVariant, breakpoint);
  const resolvedWeight = resolveWeight(
    theme,
    resolveResponsive(weight, breakpoint) ?? recipe.weight,
  );

  return {
    color: resolveColorValue(theme, resolvedColor),
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
