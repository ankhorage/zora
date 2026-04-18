import type React from 'react';

export interface SettingsLayoutProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  sidebar: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  testID?: string;
}
