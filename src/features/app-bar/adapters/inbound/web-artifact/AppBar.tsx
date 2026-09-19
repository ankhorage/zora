import { ResponsiveProvider } from '@ankhorage/surface';
import React from 'react';

import type { AppBarProps } from '../../../../../types/app-bar';
import { AppBar as CanonicalAppBar } from '../AppBar';

/*** Render the standalone browser AppBar with its required responsive runtime in the same bundle. */
export function AppBar(props: AppBarProps) {
  return (
    <ResponsiveProvider>
      <CanonicalAppBar {...props} />
    </ResponsiveProvider>
  );
}
