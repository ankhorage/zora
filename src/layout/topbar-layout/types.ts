import type React from 'react';

export interface TopbarLayoutProps {
  topbar: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  testID?: string;
}
