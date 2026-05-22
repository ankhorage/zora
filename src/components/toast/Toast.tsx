import { Toast as SurfaceToast } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ToastProps } from './types';

function ToastInner({ mode: _mode, themeId: _themeId, ...props }: ToastProps) {
  return <SurfaceToast {...props} />;
}

/***
 * Renders a toast notification message.
 *
 * @readme
 */
export const Toast = withZoraThemeScope(ToastInner);
