import { TabBar as SurfaceTabBar } from '@ankhorage/surface';
import React from 'react';

import { Surface } from '../../foundation';
import {
  createTabBarItemPressHandler,
  resolveNavigationItems,
} from '../../internal/resolveZoraNavigationItems';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ZoraTabBarProps } from './types';

function ZoraTabBarInner({
  themeId: _themeId,
  mode: _mode,
  state,
  navigation,
  descriptors,
  routeMap,
  compact = false,
  chrome = 'raised',
  testID,
}: ZoraTabBarProps) {
  const resolved = resolveNavigationItems({
    state,
    descriptors,
    routeMap,
    kind: 'tab',
  });

  const items = resolved.map((item) => ({
    id: item.route.key,
    label: item.label,
    icon: item.metadata?.icon,
    badge: item.metadata?.badge,
    active: item.active,
    disabled: item.disabled,
    onPress: createTabBarItemPressHandler({ item, navigation }),
    accessibilityLabel: item.metadata?.accessibilityLabel,
    testID: item.metadata?.testID,
  }));

  const content = <SurfaceTabBar compact={compact} items={items} testID={testID} />;

  if (chrome === 'none') {
    return content;
  }

  return (
    <Surface variant="raised" testID={testID ? `${testID}-chrome` : undefined}>
      {content}
    </Surface>
  );
}

export const ZoraTabBar = withZoraThemeScope(ZoraTabBarInner);
