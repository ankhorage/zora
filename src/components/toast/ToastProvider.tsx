import { ToastProvider as SurfaceToastProvider } from '@ankhorage/surface';
import React from 'react';

import type { ToastProviderProps } from './types';

export function ToastProvider({ children, defaultDuration }: ToastProviderProps) {
  return <SurfaceToastProvider defaultDuration={defaultDuration}>{children}</SurfaceToastProvider>;
}
