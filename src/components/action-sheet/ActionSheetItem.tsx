import { ActionSheetItem as SurfaceActionSheetItem } from '@ankhorage/surface';
import React from 'react';

import { resolveIconSize } from '../../internal/recipes';
import { useZoraTheme } from '../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Icon } from '../icon';
import type { ActionSheetItemProps } from './types';

function ActionSheetItemInner({
  themeId: _themeId,
  mode: _mode,
  icon,
  leading,
  ...props
}: ActionSheetItemProps) {
  const { theme } = useZoraTheme();
  const resolvedLeading =
    leading ??
    (icon ? (
      <Icon {...icon} color={theme.semantics.content.muted} size={resolveIconSize('s')} />
    ) : undefined);

  return <SurfaceActionSheetItem {...props} leading={resolvedLeading} />;
}

/***
 * Renders a single selectable action row within an `ActionSheet`.
 */
export const ActionSheetItem = withZoraThemeScope(ActionSheetItemInner);
