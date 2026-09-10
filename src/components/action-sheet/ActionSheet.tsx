import { ActionSheet as SurfaceActionSheet } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import type { ActionSheetProps } from './types';

function ActionSheetInner({ mode: _mode, themeId: _themeId, ...props }: ActionSheetProps) {
  return <SurfaceActionSheet {...props} />;
}

/***
 * Presents a modal bottom sheet with a list of actions.
 */
export const ActionSheet = withZoraThemeScope(ActionSheetInner);
