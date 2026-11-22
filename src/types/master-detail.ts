import type React from 'react';

import type { ZoraBaseProps } from './base';

/** Identifies the compact pane selected by Navigator-owned route state. */
export type MasterDetailActivePane = 'master' | 'detail';

/** Controls the expanded-width presentation without changing route state. */
export type MasterDetailDesktopMode = 'split' | 'master';

/** Limits the master column to readable workspace proportions. */
export type MasterDetailMasterWidth = 25 | 30 | 35 | 40;

/**
 * Presentation-only workspace composition. The host binds activePane to Navigator route state;
 * ZORA never creates routes or handles back navigation.
 */
export interface MasterDetailProps extends ZoraBaseProps {
  master?: React.ReactNode;
  detail?: React.ReactNode;
  activePane?: MasterDetailActivePane;
  desktopMode?: MasterDetailDesktopMode;
  masterWidth?: MasterDetailMasterWidth;
}
