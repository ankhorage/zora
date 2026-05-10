import {
  DrawerNavigation as SurfaceDrawerNavigation,
  NavigationList as SurfaceNavigationList,
} from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { NavigationListProps } from './types';

function NavigationListInner({
  themeId: _themeId,
  mode: _mode,
  routes,
  routeMap,
  activeRouteKey,
  orientation = 'vertical',
  compact = false,
  onRoutePress,
  header,
  footer,
  testID,
}: NavigationListProps) {
  const items = routes.map((route) => {
    const metadata = routeMap?.[route.name];
    const active = activeRouteKey ? route.key === activeRouteKey : false;

    return {
      id: route.key,
      label: metadata?.label ?? route.name,
      icon: metadata?.icon,
      badge: metadata?.badge,
      active,
      disabled: metadata?.disabled,
      onPress: metadata?.disabled ? undefined : () => onRoutePress?.(route),
      accessibilityLabel: metadata?.accessibilityLabel,
      testID: metadata?.testID,
    };
  });

  if (header || footer) {
    return (
      <SurfaceDrawerNavigation
        compact={compact}
        footer={footer}
        header={header}
        items={items}
        testID={testID}
      />
    );
  }

  return (
    <SurfaceNavigationList
      compact={compact}
      items={items}
      orientation={orientation}
      testID={testID}
    />
  );
}

export const NavigationList = withZoraThemeScope(NavigationListInner);
