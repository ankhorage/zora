import {
  type Breakpoint,
  resolveResponsive,
  type Responsive,
  type SurfaceTheme,
} from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type {
  TextAlign,
  TextColor,
  TextEmphasis,
  TextVariant,
  TextWeight,
} from '../../../types/text';
import { resolveTypographyStyleTokens } from './resolveTypographyStyleTokens';
/*** Resolves responsive text variants and theme semantics into a native text style. */
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
  const tokens = resolveTypographyStyleTokens({
    theme,
    color: resolvedColor,
    emphasis: resolvedEmphasis,
    weight: resolveResponsive(weight, breakpoint) ?? recipe.weight,
    italic,
  });

  return {
    color: tokens.color,
    elevation: 0,
    fontFamily: resolvedVariant === 'code' ? 'monospace' : tokens.fontFamily,
    fontSize: recipe.fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: tokens.fontWeight,
    letterSpacing: recipe.letterSpacing,
    lineHeight: recipe.lineHeight,
    textAlign: resolvedAlign,
    textTransform: recipe.textTransform,
  };
}

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
