import { Badge as SurfaceBadge } from '@ankhorage/surface';
import React from 'react';

import { resolveBadgeRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { BadgeProps } from './types';

function BadgeInner({
  themeId: _themeId,
  mode: _mode,
  children,
  tone,
  emphasis,
  size,
  ...props
}: BadgeProps) {
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

export const Badge = withZoraThemeScope(BadgeInner);
