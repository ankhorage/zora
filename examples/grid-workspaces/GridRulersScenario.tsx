import React from 'react';
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
    <React.Suspense fallback={null}>
      <GridRulersScenarioContent />
    </React.Suspense>
  );
}

const GridRulersScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');

  if (!hasGridRulerComponents(zora)) {
    throw new Error(
      'GridRulersScenario requires a released @ankhorage/zora version with grid rulers.',
    );
  }

  return { default: () => renderGridRulersScenario(zora) };
});

/*** Checks the installed public package surface before rendering its current grid-ruler components. */
function hasGridRulerComponents(value: object): value is GridRulerComponents {
  return (
    'GridLineOverlay' in value &&
    typeof value.GridLineOverlay === 'function' &&
    'GridRuler' in value &&
    typeof value.GridRuler === 'function'
  );
}

/*** Composes the public passive-ruler surfaces without coupling the example to local package source. */
function renderGridRulersScenario({ GridLineOverlay, GridRuler }: GridRulerComponents) {
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

interface GridRulerComponents {
  readonly GridLineOverlay: React.ComponentType<Record<string, unknown>>;
  readonly GridRuler: React.ComponentType<Record<string, unknown>>;
}
