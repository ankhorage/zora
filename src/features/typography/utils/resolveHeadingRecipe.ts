import type { SurfaceTheme } from '@ankhorage/surface';
import type { TextStyle } from 'react-native';

import type {
  HeadingAlign,
  HeadingColor,
  HeadingEmphasis,
  HeadingLevel,
  HeadingSize,
  HeadingWeight,
} from '../../../types/heading';
import { resolveHeadingSizeFromLevel } from './resolveHeadingSizeFromLevel';
import { resolveTypographyStyleTokens } from './resolveTypographyStyleTokens';
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
  const tokens = resolveTypographyStyleTokens({
    theme,
    color,
    emphasis,
    weight: weight ?? recipe.weight,
    italic,
  });

  return {
    color: tokens.color,
    elevation: 0,
    fontFamily: tokens.fontFamily,
    fontSize: recipe.fontSize,
    fontStyle: italic ? 'italic' : 'normal',
    fontWeight: tokens.fontWeight,
    lineHeight: recipe.lineHeight,
    textAlign: align,
  };
}

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
