import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import { resolveButtonRecipe } from '../../internal/recipes';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ButtonProps } from './types';

function ButtonInner({
  themeId: _themeId,
  mode: _mode,
  color,
  variant,
  size,
  ...props
}: ButtonProps) {
  const recipe = resolveButtonRecipe({ color, variant, size });

  return (
    <SurfaceButton {...props} color={recipe.color} size={recipe.size} variant={recipe.variant} />
  );
}

/***
 * Theme-aware action control for primary, secondary, destructive, and neutral actions.
 *
 * Use `Button` for explicit user actions that should follow ZORA's semantic color,
 * variant, and size recipes across React Native and React Native Web.
 *
 * @example Basic action
 * ```tsx
 * <Button color="primary" variant="solid" onPress={save}>Save</Button>
 * ```
 */
export const Button = withZoraThemeScope(ButtonInner);
