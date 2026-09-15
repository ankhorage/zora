import { Button as SurfaceButton } from '@ankhorage/surface';
import React from 'react';

import type { ButtonProps } from '../../../../types/button';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraThemeRecipe } from '../../../theme/composition/useZoraThemeRecipe';
import { resolveButtonThemeRecipe } from '../../utils/resolveButtonThemeRecipe';
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

function ButtonInner({
  themeId: _themeId,
  mode: _mode,
  color,
  variant,
  size,
  interactionPolicy,
  ...props
}: ButtonProps) {
  const themeFields = useZoraThemeRecipe('Button');
  const recipe = resolveButtonThemeRecipe({ color, variant, size, themeFields });

  return (
    <SurfaceButton
      {...props}
      color={recipe.color}
      size={recipe.size}
      variant={recipe.variant}
      interactionPolicy={interactionPolicy}
    />
  );
}
