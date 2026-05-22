import { NavigationItem as SurfaceNavigationItem } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { NavigationItemProps } from './types';

function NavigationItemInner({
  themeId: _themeId,
  mode: _mode,
  route,
  metadata,
  active = false,
  compact = false,
  onPress,
  testID,
}: NavigationItemProps) {
  return (
    <SurfaceNavigationItem
      compact={compact}
      item={{
        id: route.key,
        label: metadata?.label ?? route.name,
        icon: metadata?.icon,
        badge: metadata?.badge,
        active,
        disabled: metadata?.disabled,
        onPress,
        accessibilityLabel: metadata?.accessibilityLabel,
        testID: metadata?.testID,
      }}
      testID={testID}
    />
  );
}

/***
 * Renders a single navigation entry with active/disabled state support.
 *
 * @readme
 */
export const NavigationItem = withZoraThemeScope(NavigationItemInner);
