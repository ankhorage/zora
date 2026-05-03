import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import { resolveButtonRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ButtonProps } from './types';

function ButtonInner({
  themeId: _themeId,
  mode: _mode,
  tone,
  emphasis,
  size,
  ...props
}: ButtonProps) {
  const recipe = resolveButtonRecipe({ tone, emphasis, size });

  return (
    <SurfaceButton {...props} size={recipe.size} tone={recipe.tone} variant={recipe.variant} />
  );
}

export const Button = withZoraThemeScope(ButtonInner);
