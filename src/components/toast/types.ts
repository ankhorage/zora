import type {
  ToastOptions as SurfaceToastOptions,
  ToastProps as SurfaceToastProps,
  ToastStatus as SurfaceToastStatus,
} from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export type ToastStatus = SurfaceToastStatus;
export type ToastOptions = SurfaceToastOptions;

export interface ToastProps extends ZoraBaseProps, Omit<SurfaceToastProps, 'testID'> {}

export interface ToastProviderProps {
  children: React.ReactNode;
  defaultDuration?: number;
}
