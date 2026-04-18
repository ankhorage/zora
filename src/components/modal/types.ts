import type { ModalProps as SurfaceModalProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraContentWidth } from '../../internal/recipes';

export interface ModalProps extends Pick<
  SurfaceModalProps,
  'closeOnBackdrop' | 'onDismiss' | 'testID' | 'visible'
> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  width?: ZoraContentWidth;
}
