import { KeyboardAvoidingView as SurfaceKeyboardAvoidingView } from '@ankhorage/surface';
import React from 'react';

import type { KeyboardAvoidingViewProps } from '../../../../types/keyboard-avoiding-view';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';

/*** Native keyboard-aware container exposed through the canonical ZORA feature boundary. */
export const KeyboardAvoidingView = withZoraThemeScope(KeyboardAvoidingViewInner);

/*** Forwards React Native keyboard avoidance and view props without adding platform behavior. */
function KeyboardAvoidingViewInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: KeyboardAvoidingViewProps) {
  return <SurfaceKeyboardAvoidingView {...props} />;
}
