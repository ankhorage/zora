import React from 'react';

import { AppBar } from '../../components/app-bar';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Screen } from '../screen';
import { SidebarLayout } from '../sidebar-layout';
import type { SettingsLayoutProps } from './types';

function SettingsLayoutInner({
  themeId: _themeId,
  mode: _mode,
  title,
  description,
  sidebar,
  children,
  actions,
  testID,
}: SettingsLayoutProps) {
  return (
    <>
      {title ? <AppBar actions={actions} subtitle={description} title={title} /> : null}
      <Screen testID={testID}>
        <SidebarLayout sidebar={sidebar}>{children}</SidebarLayout>
      </Screen>
    </>
  );
}

export const SettingsLayout = withZoraThemeScope(SettingsLayoutInner);
