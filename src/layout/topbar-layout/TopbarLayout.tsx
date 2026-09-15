import React from 'react';

import { View } from '../../features/layout/public';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { SidebarLayout } from '../sidebar-layout';
import type { TopbarLayoutProps } from './types';

function TopbarLayoutInner({
  themeId: _themeId,
  mode: _mode,
  interactionPolicy: _interactionPolicy,
  topbar,
  children,
  sidebar,
  testID,
}: TopbarLayoutProps) {
  return (
    <View gap="l" testID={testID}>
      <View>{topbar}</View>
      {sidebar ? <SidebarLayout sidebar={sidebar}>{children}</SidebarLayout> : children}
    </View>
  );
}

/***
 * Layout that composes a top bar with optional sidebar and content.
 *
 
 */
export const TopbarLayout = withZoraThemeScope(TopbarLayoutInner);
