import type {
  TabListProps as SurfaceTabListProps,
  TabPanelProps as SurfaceTabPanelProps,
  TabProps as SurfaceTabProps,
  TabsProps as SurfaceTabsProps,
} from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export interface TabsProps extends ZoraBaseProps, Omit<SurfaceTabsProps, 'testID'> {}

export interface TabListProps extends ZoraBaseProps, Omit<SurfaceTabListProps, 'testID'> {}

export interface TabProps
  extends ZoraBaseProps, Omit<SurfaceTabProps, 'children' | 'interactionPolicy' | 'testID'> {
  label: string;
}

export interface TabPanelProps extends ZoraBaseProps, Omit<SurfaceTabPanelProps, 'testID'> {}
