import React from 'react';

import type { ExplorerProps } from '../../../../types/explorer';
import { Explorer } from './Explorer';

/*** Specialized media catalogue presentation sharing the canonical Explorer/TileGrid path. */
export function MediaExplorer(props: ExplorerProps) {
  return (
    <Explorer
      {...props}
      items={props.items.filter((item) =>
        item.kind === 'image' || item.kind === 'video' || item.kind === 'audio',
      )}
    />
  );
}
