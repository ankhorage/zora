import type React from 'react';

import type { ZoraBaseProps } from './base';

/** Identifies the compact pane selected by host-owned route state. */
export type MasterDetailActivePane = 'master' | 'detail';

/** Controls the expanded-width presentation without changing route state. */
export type MasterDetailDesktopMode = 'split' | 'master';

/** Limits the master column to readable workspace proportions. */
export type MasterDetailMasterWidth = 25 | 30 | 35 | 40;

/**
 * Presentation-only workspace composition. Place it as a direct child of a non-scrolling Screen
 * so its panes own bounded scrolling. The host supplies activePane from its route state; ZORA
 * never creates routes or handles back navigation.
 */
export interface MasterDetailProps extends ZoraBaseProps {
  /** The first child is the master pane and the second child is the detail pane. */
  children?: React.ReactNode;
  activePane?: MasterDetailActivePane;
  desktopMode?: MasterDetailDesktopMode;
  masterWidth?: MasterDetailMasterWidth;
}
