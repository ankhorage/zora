import { ToastProvider as SurfaceToastProvider } from '@ankhorage/surface';
import { BottomSheetProvider } from '@ankhorage/surface/bottom-sheet';

import type { ZoraRuntimeCapabilitiesProps } from '../../../types/provider';

/*** Installs optional native runtime capabilities without forcing unused hosts. */
export function ZoraRuntimeCapabilities({
  bottomSheet,
  children,
  toast,
}: ZoraRuntimeCapabilitiesProps) {
  const toastContent = toast ? (
    <SurfaceToastProvider {...(toast === true ? {} : toast)}>{children}</SurfaceToastProvider>
  ) : (
    children
  );

  return bottomSheet ? <BottomSheetProvider>{toastContent}</BottomSheetProvider> : toastContent;
}
