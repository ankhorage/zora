import React from 'react';

import { Page } from '../page';
import { PageHeader } from '../page-header';
import { SidebarLayout } from '../sidebar-layout';
import type { SettingsLayoutProps } from './types';

export function SettingsLayout({
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
