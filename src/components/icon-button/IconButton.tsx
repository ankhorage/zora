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
  emphasis = 'ghost',
  tone = 'neutral',
  size = 'm',
  ...props
}: IconButtonProps) {
  const recipe = resolveButtonRecipe({ emphasis, tone, size });

  return (
    <SurfaceIconButton
      {...props}
      icon={icon}
      accessibilityLabel={label}
      size={recipe.size}
      tone={recipe.tone}
      variant={recipe.variant}
    />
  );
}

export const IconButton = withZoraThemeScope(IconButtonInner);
