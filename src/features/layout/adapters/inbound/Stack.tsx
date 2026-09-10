import { Stack as SurfaceStack } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { StackProps } from '../../../../types/layout';

/*** Adapts the themed Surface Stack primitive to ZORA scope and interaction props. */
export const Stack = withZoraThemeScope(StackInner);

/*** Forwards presentation props to the published Surface boundary. */
function StackInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: StackProps) {
  return <SurfaceStack {...props} />;
}
