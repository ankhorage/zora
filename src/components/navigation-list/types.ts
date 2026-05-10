import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';
import type { ZoraNavigationRouteMetadata, ZoraNavigationRouteState } from '../navigation-item';

export type ZoraNavigationRouteMap = Partial<Record<string, ZoraNavigationRouteMetadata>>;

export interface NavigationListProps extends ZoraBaseProps {
  routes: readonly ZoraNavigationRouteState[];
  routeMap?: ZoraNavigationRouteMap;
  activeRouteKey?: string;
  orientation?: 'vertical' | 'horizontal';
  compact?: boolean;
  onRoutePress?: (route: ZoraNavigationRouteState) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
