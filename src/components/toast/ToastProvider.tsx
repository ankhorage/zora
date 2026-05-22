import { ToastProvider as SurfaceToastProvider } from '@ankhorage/surface';
import React from 'react';

import type { ToastProviderProps } from './types';

/***
 * Provides toast state and rendering context for `useToast` and `Toast`.
 *
 
 */
export function ToastProvider({ children, defaultDuration }: ToastProviderProps) {
  if (defaultDuration === undefined) {
    return <SurfaceToastProvider>{children}</SurfaceToastProvider>;
  }

  return <SurfaceToastProvider defaultDuration={defaultDuration}>{children}</SurfaceToastProvider>;
}
