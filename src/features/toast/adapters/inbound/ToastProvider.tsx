import { ToastProvider as SurfaceToastProvider } from '@ankhorage/surface';
import React from 'react';

import type { ToastProviderProps } from '../../../../types/toast';

/*** Provides toast state and rendering context through the Surface runtime host. */
export function ToastProvider(props: ToastProviderProps) {
  return <SurfaceToastProvider {...props} />;
}
