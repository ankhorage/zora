import { IconButton as SurfaceIconButton } from '@ankhorage/surface';
import React from 'react';

import { resolveButtonRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { IconButtonProps } from './types';

function IconButtonInner({
  themeId: _themeId,
  mode: _mode,
  icon,
  label,
  variant = 'ghost',
  color = 'neutral',
  size = 'm',
  ...props
}: IconButtonProps) {
  const recipe = resolveButtonRecipe({ color, variant, size });

  return (
    <SurfaceIconButton
      {...props}
      icon={icon}
      accessibilityLabel={label}
      color={recipe.color}
      size={recipe.size}
      variant={recipe.variant}
    />
  );
}

export const IconButton = withZoraThemeScope(IconButtonInner);
