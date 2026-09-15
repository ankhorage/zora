import type {
  ToastController as SurfaceToastController,
  ToastOptions as SurfaceToastOptions,
  ToastProps as SurfaceToastProps,
  ToastProviderProps as SurfaceToastProviderProps,
  ToastStatus as SurfaceToastStatus,
} from '@ankhorage/surface';

import type { ZoraBaseProps } from './base';

export type ToastStatus = SurfaceToastStatus;
export type ToastOptions = SurfaceToastOptions;
export type ToastController = SurfaceToastController;
export type ToastProviderProps = SurfaceToastProviderProps;

export interface ToastProps extends ZoraBaseProps, Omit<SurfaceToastProps, 'testID'> {}
