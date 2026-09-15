import { Toast as SurfaceToast } from '@ankhorage/surface';
import React from 'react';

import type { ToastProps } from '../../../../types/toast';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Renders a toast notification message with ZORA theme scoping. */
export const Toast = withZoraThemeScope(ToastInner);

/*** Applies the ZORA theme scope before delegating toast presentation to Surface. */
function ToastInner({ mode: _mode, themeId: _themeId, ...props }: ToastProps) {
  return <SurfaceToast {...props} />;
}
