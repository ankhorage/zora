import { GridLineOverlay, GridRuler } from '@ankhorage/zora';
import { View } from 'react-native';

const viewport = {
  height: 240,
  offsetX: 40,
  offsetY: 20,
  pixelsPerUnitX: 2,
  pixelsPerUnitY: 2,
  width: 320,
} as const;

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

/*** Renders passive, world-projected rulers, grid lines, and named guides from the released ZORA package. */
export function GridRulersScenario() {
  return (
    <View style={{ height: viewport.height + 24, position: 'relative', width: viewport.width }}>
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
