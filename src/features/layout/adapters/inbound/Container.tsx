import { Container as SurfaceContainer } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ContainerProps } from '../../../../types/layout';

/*** Adapts the themed Surface Container primitive to ZORA scope and interaction props. */
export const Container = withZoraThemeScope(ContainerInner);

/*** Forwards presentation props to the published Surface boundary. */
function ContainerInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  ...props
}: ContainerProps) {
  return <SurfaceContainer {...props} />;
}
