import type React from 'react';

import type { ZoraNavigationRouteMap } from '../../components/navigation-list';
import type {
  ZoraDrawerNavigation,
  ZoraNavigationDescriptors,
  ZoraNavigationState,
} from '../../internal/resolveZoraNavigationItems';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ZoraDrawerContentProps extends ZoraBaseProps {
  state: ZoraNavigationState;
  navigation: ZoraDrawerNavigation;
  descriptors?: ZoraNavigationDescriptors | undefined;
  routeMap?: ZoraNavigationRouteMap | undefined;
  compact?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  testID?: string;
}
