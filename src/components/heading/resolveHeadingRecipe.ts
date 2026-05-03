import type { AnkhTheme, FontWeight } from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type { HeadingAlign, HeadingLevel, HeadingSize, HeadingTone, HeadingWeight } from './types';

interface ResolveHeadingRecipeOptions {
  level: HeadingLevel;
  size?: HeadingSize;
  tone?: HeadingTone;
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

function resolveSizeRecipe(theme: AnkhTheme, size: HeadingSize): HeadingRecipe {
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

function resolveToneColor(theme: AnkhTheme, tone: HeadingTone): string {
  switch (tone) {
    case 'muted':
      return theme.semantics.content.muted;
    case 'subtle':
      return theme.semantics.content.subtle;
    case 'inverse':
      return theme.semantics.content.inverse;
    case 'primary':
      return theme.semantics.brand.base;
    case 'danger':
      return theme.semantics.danger.base;
    case 'success':
      return theme.semantics.success.base;
    case 'warning':
      return theme.semantics.warning.base;
    case 'default':
    default:
      return theme.semantics.content.default;
  }
}

function resolveWeight(theme: AnkhTheme, weight: HeadingWeight): FontWeight {
  return theme.typography.weights[weight];
}

function resolveFontFamily({
  theme,
  weight,
  italic,
}: {
  theme: AnkhTheme;
  weight: FontWeight;
  italic: boolean;
}): string | undefined {
  return theme.typography.fonts[italic ? 'italic' : 'normal'][weight];
}

export function resolveHeadingRecipe(
  theme: AnkhTheme,
  { align, italic = false, level, size, tone = 'default', weight }: ResolveHeadingRecipeOptions,
): TextStyle {
  const recipe = resolveSizeRecipe(theme, size ?? resolveHeadingSizeFromLevel(level));
  const resolvedWeight = resolveWeight(theme, weight ?? recipe.weight);

  return {
    color: resolveToneColor(theme, tone),
    elevation: 0,
    fontFamily: resolveFontFamily({ theme, weight: resolvedWeight, italic }),
    fontSize: recipe.fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: resolvedWeight,
    lineHeight: recipe.lineHeight,
    textAlign: align,
  };
}
