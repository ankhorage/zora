import type React from 'react';

export interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  sidebarWidth?: number;
  asideWidth?: number;
  testID?: string;
}
