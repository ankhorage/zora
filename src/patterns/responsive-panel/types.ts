import type React from 'react';

export type ResponsivePanelSide = 'left' | 'right';
export type ResponsivePanelDesktopMode = 'inline' | 'floating';
export type ResponsivePanelMobileMode = 'drawer' | 'modal';

import type { ZoraBaseProps } from '../../theme/ZoraBaseProps';

export interface ResponsivePanelProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: ResponsivePanelSide;
  desktopMode?: ResponsivePanelDesktopMode;
  mobileMode?: ResponsivePanelMobileMode;
  compact?: boolean;
}
