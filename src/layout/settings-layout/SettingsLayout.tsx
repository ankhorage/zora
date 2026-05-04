import React from 'react';

import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { Page } from '../page';
import { PageHeader } from '../page-header';
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
    <Page
      header={
        title ? <PageHeader actions={actions} description={description} title={title} /> : null
      }
      testID={testID}
    >
      <SidebarLayout sidebar={sidebar}>{children}</SidebarLayout>
    </Page>
  );
}

export const SettingsLayout = withZoraThemeScope(SettingsLayoutInner);
