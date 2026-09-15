import { ToastProvider as SurfaceToastProvider } from '@ankhorage/surface';

import type { ZoraRuntimeCapabilitiesProps } from '../../../types/provider';

/*** Installs only web-relevant optional runtime capabilities. */
export function ZoraRuntimeCapabilities({ children, toast }: ZoraRuntimeCapabilitiesProps) {
  if (!toast) return children;

  return <SurfaceToastProvider {...(toast === true ? {} : toast)}>{children}</SurfaceToastProvider>;
}
