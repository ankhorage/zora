import type { FontWeight, RoleSemantics, SurfaceTheme } from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type {
  HeadingAlign,
  HeadingColor,
  HeadingEmphasis,
  HeadingLevel,
  HeadingSize,
  HeadingWeight,
} from './types';

interface ResolveHeadingRecipeOptions {
  level: HeadingLevel;
  size?: HeadingSize;
  color?: HeadingColor;
  emphasis?: HeadingEmphasis;
  align?: HeadingAlign;
  weight?: HeadingWeight;
  italic?: boolean;
}

interface HeadingRecipe {
  fontSize: number;
  lineHeight: number;
  weight: HeadingWeight;
}

export function resolveHeadingSizeFromLevel(level: HeadingLevel): HeadingSize {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    case 6:
      return 'h6';
  }
}

function resolveHeadingLevelFromSize(size: Exclude<HeadingSize, 'display'>): HeadingLevel {
  switch (size) {
    case 'h1':
      return 1;
    case 'h2':
      return 2;
    case 'h3':
      return 3;
    case 'h4':
      return 4;
    case 'h5':
      return 5;
    case 'h6':
      return 6;
  }
}

function resolveSizeRecipe(theme: SurfaceTheme, size: HeadingSize): HeadingRecipe {
  if (size === 'display') {
    const fontSize = theme.typography.sizes['3xl'];

    return {
      fontSize,
      lineHeight: fontSize + 8,
      weight: 'bold',
    };
  }

  const heading = theme.typography.headings[resolveHeadingLevelFromSize(size)];

  return {
    fontSize: heading.size,
    lineHeight: heading.lineHeight,
    weight: heading.weight,
  };
}

function resolveRoleSemantics(theme: SurfaceTheme, color: HeadingColor): RoleSemantics {
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

function resolveHeadingColor(
  theme: SurfaceTheme,
  emphasis: HeadingEmphasis,
  color?: HeadingColor,
): string {
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

function resolveWeight(theme: SurfaceTheme, weight: HeadingWeight): FontWeight {
  switch (weight) {
    case 'thin':
      return theme.typography.weights.thin;
    case 'extraLight':
      return theme.typography.weights.extraLight;
    case 'light':
      return theme.typography.weights.light;
    case 'medium':
      return theme.typography.weights.medium;
    case 'semiBold':
      return theme.typography.weights.semiBold;
    case 'bold':
      return theme.typography.weights.bold;
    case 'extraBold':
      return theme.typography.weights.extraBold;
    case 'black':
      return theme.typography.weights.black;
    case 'regular':
    default:
      return theme.typography.weights.regular;
  }
}

function resolveFontFamily({
  theme,
  weight,
  italic,
}: {
  theme: SurfaceTheme;
  weight: FontWeight;
  italic: boolean;
}): string | undefined {
  const fonts = italic ? theme.typography.fonts.italic : theme.typography.fonts.normal;

  for (const [fontWeight, fontFamily] of Object.entries(fonts)) {
    if (fontWeight === weight) {
      return fontFamily;
    }
  }

  return undefined;
}

export function resolveHeadingRecipe(
  theme: SurfaceTheme,
  {
    align,
    color,
    emphasis = 'default',
    italic = false,
    level,
    size,
    weight,
  }: ResolveHeadingRecipeOptions,
): TextStyle {
  const recipe = resolveSizeRecipe(theme, size ?? resolveHeadingSizeFromLevel(level));
  const resolvedWeight = resolveWeight(theme, weight ?? recipe.weight);

  return {
    color: resolveHeadingColor(theme, emphasis, color),
    elevation: 0,
    fontFamily: resolveFontFamily({ theme, weight: resolvedWeight, italic }),
    fontSize: recipe.fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: resolvedWeight,
    lineHeight: recipe.lineHeight,
    textAlign: align,
  };
}
