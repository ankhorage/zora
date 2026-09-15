import { Badge as SurfaceBadge } from '@ankhorage/surface';
import React from 'react';

import type { BadgeProps } from '../../../../types/badge';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { resolveBadgeRecipe } from '../../utils/resolveBadgeRecipe';
/***
 * Shows a small status, label, or count indicator.
 */
export const Badge = withZoraThemeScope(BadgeInner);

function BadgeInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
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
