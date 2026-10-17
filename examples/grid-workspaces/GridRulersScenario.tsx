import type { GridViewport } from '@ankhorage/grid-view';
import { GridLineOverlay, GridRuler, GridView } from '@ankhorage/zora';
import React from 'react';
import { Text, View } from 'react-native';

import { ResponsiveWidth } from './ResponsiveWidth';

const viewportHeight = 240;

const xTickSource = {
  kind: 'ticks' as const,
  specification: { majorEvery: 5, mode: 'fixed' as const, step: 20 },
};

const yTickSource = {
  categories: [
    { id: 'intro', size: 35, start: 40 },
    { id: 'verse', size: 65, start: 75 },
    { id: 'chorus', size: 120, start: 140 },
  ],
  kind: 'categories' as const,
};

const sections = [
  { height: 35, id: 'intro', width: 600, x: 0, y: 40 },
  { height: 65, id: 'verse', width: 600, x: 0, y: 75 },
  { height: 120, id: 'chorus', width: 600, x: 0, y: 140 },
] as const;

/*** Renders passive rulers, grid lines and a named guide that follow the pan and zoom of a controlled GridView. */
export function GridRulersScenario() {
  return (
    <View style={{ gap: 8 }}>
      <Text>
        Scroll, pinch, or use the pan and zoom controls: the rulers, grid lines and playhead guide
        follow the same controlled viewport as the grid.
      </Text>
      <ResponsiveWidth maxWidth={480}>
        {(width) => <GridRulersViewport width={width} />}
      </ResponsiveWidth>
    </View>
  );
}

/*** Owns the single controlled viewport shared by the grid and its passive ruler projections. */
function GridRulersViewport({ width }: { readonly width: number }) {
  const [viewportState, setViewport] = React.useState<GridViewport>({
    height: viewportHeight,
    offsetX: 40,
    offsetY: 20,
    pixelsPerUnitX: 2,
    pixelsPerUnitY: 2,
    width,
  });
  const viewport = React.useMemo(() => ({ ...viewportState, width }), [viewportState, width]);

  return (
    <View style={{ height: viewportHeight, position: 'relative', width }}>
      <GridView
        contentHeight={400}
        contentWidth={600}
        height={viewportHeight}
        items={sections}
        renderItem={(item) => (
          <View style={{ backgroundColor: '#e2e8f0', flex: 1, opacity: 0.6 }}>
            <Text>{item.id}</Text>
          </View>
        )}
        viewport={viewport}
        width={width}
        onViewportChange={setViewport}
      />
      <GridLineOverlay
        guides={[{ axis: 'x', id: 'playhead', label: 'Playhead', position: 80 }]}
        viewport={viewport}
        xTickSource={xTickSource}
        yTickSource={yTickSource}
      />
      <GridRuler axis="x" tickSource={xTickSource} viewport={viewport} />
    </View>
  );
}
