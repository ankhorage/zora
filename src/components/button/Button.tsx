import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import { resolveButtonRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ButtonProps } from './types';

function ButtonInner({
  themeId: _themeId,
  mode: _mode,
  color,
  emphasis,
  size,
  ...props
}: ButtonProps) {
  const recipe = resolveButtonRecipe({ color, variant: emphasis, size });

  return (
    <SurfaceButton {...props} color={recipe.color} size={recipe.size} variant={recipe.variant} />
  );
}

export const Button = withZoraThemeScope(ButtonInner);
