import type { DrawerProps as SurfaceDrawerProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface DrawerProps
  extends
    ZoraBaseProps,
    Pick<
      Omit<SurfaceDrawerProps, 'mode' | 'themeId'>,
      'closeOnBackdrop' | 'onDismiss' | 'position' | 'visible'
    > {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}
