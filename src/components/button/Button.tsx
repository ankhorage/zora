import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import { resolveButtonRecipe } from '../../internal/recipes';
import type { ButtonProps } from './types';

export function Button({ tone, emphasis, size, ...props }: ButtonProps) {
  const recipe = resolveButtonRecipe({ tone, emphasis, size });

  return (
    <SurfaceButton {...props} size={recipe.size} tone={recipe.tone} variant={recipe.variant} />
  );
}
