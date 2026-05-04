import type { ModalProps as SurfaceModalProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraContentWidth } from '../../internal/recipes';
import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ModalProps
  extends
    ZoraBaseProps,
    Pick<Omit<SurfaceModalProps, 'mode' | 'themeId'>, 'closeOnBackdrop' | 'onDismiss' | 'visible'> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
}
