import type { DrawerProps as SurfaceDrawerProps } from '@ankhorage/surface';
import type React from 'react';

export interface DrawerProps extends Pick<
  SurfaceDrawerProps,
  'closeOnBackdrop' | 'onDismiss' | 'position' | 'testID' | 'visible'
> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}
