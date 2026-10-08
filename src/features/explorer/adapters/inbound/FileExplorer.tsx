import React from 'react';

import type { ExplorerProps } from '../../../../types/explorer';
import { Explorer } from './Explorer';

/*** File and folder presentation using the exact same TileGrid and selection model. */
export function FileExplorer(props: ExplorerProps) {
  return <Explorer {...props} />;
}
