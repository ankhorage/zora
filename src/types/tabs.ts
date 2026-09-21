import type {
  TabPanelProps as SurfaceTabPanelProps,
  TabsProps as SurfaceTabsProps,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from './base';

export interface TabsProps extends ZoraBaseProps, Omit<SurfaceTabsProps, 'testID'> {}

export interface TabListProps extends ZoraBaseProps {
  children?: React.ReactNode;
}

export interface TabProps extends ZoraBaseProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabPanelProps extends ZoraBaseProps, Omit<SurfaceTabPanelProps, 'testID'> {}
