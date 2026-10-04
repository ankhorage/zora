import React from 'react';

import type { AppHeaderProps } from '../../../../types/app-header';
import { AppBar } from '../../../app-bar/public';

/*** Composes application header chrome through the scoped ZORA AppBar. */
export function AppHeader(props: AppHeaderProps) {
  return <AppBar {...props} />;
}
