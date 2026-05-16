import { Badge as SurfaceBadge } from '@ankhorage/surface';
import React from 'react';

import { resolveBadgeRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { BadgeProps } from './types';

function BadgeInner({
  themeId: _themeId,
  mode: _mode,
  children,
  color,
  variant,
  size,
  ...props
}: BadgeProps) {
  const recipe = resolveBadgeRecipe({ color, variant, size });

  return (
    <SurfaceBadge
      {...props}
      content={children}
      color={recipe.color}
      size={recipe.size}
      variant={recipe.variant}
    />
  );
}

export const Badge = withZoraThemeScope(BadgeInner);
