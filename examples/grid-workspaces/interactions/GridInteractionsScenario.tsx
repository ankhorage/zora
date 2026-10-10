import React from 'react';
import { View } from 'react-native';

import { GridInteractions, type GridInteractionIntent } from '@ankhorage/zora';

const viewport = {
  height: 320,
  offsetX: 0,
  offsetY: 0,
  pixelsPerUnitX: 1,
  pixelsPerUnitY: 1,
  width: 480,
};

const items = [
  { height: 80, id: 'first', width: 120, x: 40, y: 40 },
  { height: 80, id: 'second', width: 120, x: 220, y: 140 },
];

/** Demonstrates composing controlled interactions around any caller-owned item presentation. */
export function GridInteractionsScenario() {
  const [intent, setIntent] = React.useState<GridInteractionIntent | undefined>();
  return (
    <GridInteractions
      items={items}
      onIntent={setIntent}
      selectedIds={intent?.itemIds}
      viewport={viewport}
    >
      <View style={{ height: viewport.height, width: viewport.width }} />
    </GridInteractions>
  );
}
