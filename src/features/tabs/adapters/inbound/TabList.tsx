import { TabList as SurfaceTabList } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { TabListProps } from '../../../../types/tabs';

/*** Renders the accessible list of tabs for a Tabs composition. */
export const TabList = withZoraThemeScope(TabListInner);

/*** Delegates tablist semantics and keyboard navigation to Surface. */
function TabListInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  children,
  testID,
}: TabListProps) {
  return <SurfaceTabList testID={testID}>{children}</SurfaceTabList>;
}
