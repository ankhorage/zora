import React from 'react';
import { ActivityIndicator as ReactNativeActivityIndicator } from 'react-native';

import { useZoraTheme } from '../../../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ActivityIndicatorProps } from '../../../../types/activity-indicator';

/*** Render native loading feedback with a semantic ZORA fallback color. */
function ActivityIndicatorInner({
  themeId: _themeId,
  mode: _mode,
  color,
  ...props
}: ActivityIndicatorProps) {
  const { theme } = useZoraTheme();

  return <ReactNativeActivityIndicator {...props} color={color ?? theme.semantics.content.muted} />;
}

/*** Native activity indicator exposed as a serializable ZORA feedback node. */
export const ActivityIndicator = withZoraThemeScope(ActivityIndicatorInner);
