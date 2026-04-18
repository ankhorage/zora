import { Badge as SurfaceBadge } from '@ankhorage/surface';
import React from 'react';

import { resolveBadgeRecipe } from '../../internal/recipes';
import type { BadgeProps } from './types';

export function Badge({ children, tone, emphasis, size, ...props }: BadgeProps) {
  const recipe = resolveBadgeRecipe({ tone, emphasis, size });

  return (
    <SurfaceBadge
      {...props}
      content={children}
      size={recipe.size}
      tone={recipe.tone}
      variant={recipe.variant}
    />
  );
}
