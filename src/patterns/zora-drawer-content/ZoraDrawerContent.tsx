import { DrawerNavigation as SurfaceDrawerNavigation } from '@ankhorage/surface';
import React from 'react';

import {
  createDrawerItemPressHandler,
  resolveNavigationItems,
} from '../../internal/resolveZoraNavigationItems';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraDrawerContentProps } from './types';

function ZoraDrawerContentInner({
  themeId: _themeId,
  mode: _mode,
  state,
  navigation,
  descriptors,
  routeMap,
  compact = false,
  header,
  footer,
  testID,
}: ZoraDrawerContentProps) {
  const resolved = resolveNavigationItems({
    state,
    descriptors,
    routeMap,
    kind: 'drawer',
  });

  const items = resolved.map((item) => ({
    id: item.route.key,
    label: item.label,
    icon: item.metadata?.icon,
    badge: item.metadata?.badge,
    active: item.active,
    disabled: item.disabled,
    onPress: createDrawerItemPressHandler({ item, navigation }),
    accessibilityLabel: item.metadata?.accessibilityLabel,
    testID: item.metadata?.testID,
  }));

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

/***
 * Standard drawer content pattern for ZORA navigation lists.
 *
 
 */
export const ZoraDrawerContent = withZoraThemeScope(ZoraDrawerContentInner);
