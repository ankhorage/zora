import type { ButtonIconSpec } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ZoraNavigationRouteMetadata {
  label?: React.ReactNode;
  icon?: ButtonIconSpec;
  badge?: React.ReactNode;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export interface ZoraNavigationRouteState {
  key: string;
  name: string;
}

export interface NavigationItemProps extends ZoraBaseProps {
  route: ZoraNavigationRouteState;
  metadata?: ZoraNavigationRouteMetadata;
  active?: boolean;
  compact?: boolean;
  onPress?: () => void;
}
