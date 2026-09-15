import { IconButton as SurfaceIconButton } from '@ankhorage/surface';
import React from 'react';

import type { IconButtonProps } from '../../../../types/icon-button';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { resolveButtonRecipe } from '../../utils/resolveButtonRecipe';
/***
 * Icon-only button for compact actions; requires an accessible `label`.
 */
export const IconButton = withZoraThemeScope(IconButtonInner);

function IconButtonInner({
  themeId: _themeId,
  mode: _mode,
  icon,
  iconName,
  label,
  variant = 'ghost',
  color = 'neutral',
  size = 'm',
  interactionPolicy,
  ...props
}: IconButtonProps) {
  const recipe = resolveButtonRecipe({ color, variant, size });

  return (
    <SurfaceIconButton
      {...props}
      icon={icon ?? { name: iconName ?? 'add' }}
      accessibilityLabel={label}
      color={recipe.color}
      size={recipe.size}
      variant={recipe.variant}
      interactionPolicy={interactionPolicy}
    />
  );
}
