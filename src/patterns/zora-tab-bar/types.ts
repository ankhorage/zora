import type React from 'react';

import type { ZoraNavigationRouteMap } from '../../components/navigation-list';
import type {
  ZoraNavigationDescriptors,
  ZoraNavigationState,
  ZoraTabBarNavigation,
} from '../../internal/resolveZoraNavigationItems';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ZoraTabBarProps extends ZoraBaseProps {
  state: ZoraNavigationState;
  navigation: ZoraTabBarNavigation;
  descriptors?: ZoraNavigationDescriptors | undefined;
  insets?: { top?: number; bottom?: number; left?: number; right?: number } | undefined;
  routeMap?: ZoraNavigationRouteMap | undefined;
  compact?: boolean;
  chrome?: 'none' | 'raised';
  testID?: string;
  labelPrefix?: React.ReactNode;
}
