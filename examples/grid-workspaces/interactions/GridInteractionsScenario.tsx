import React from 'react';
import { View } from 'react-native';

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
  return (
    <React.Suspense fallback={null}>
      <GridInteractionsScenarioContent />
    </React.Suspense>
  );
}

const GridInteractionsScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasGridInteractions(zora)) {
    throw new Error(
      'GridInteractionsScenario requires a released @ankhorage/zora version with GridInteractions.',
    );
  }
  return {
    default: () => (
      <GridInteractionsScenarioContentRenderer GridInteractions={zora.GridInteractions} />
    ),
  };
});

/** Checks the installed public package surface before rendering the independently released feature. */
function hasGridInteractions(value: object): value is GridInteractionsComponents {
  return 'GridInteractions' in value && typeof value.GridInteractions === 'function';
}

/** Renders the scenario through the released public package instead of local repository source. */
function GridInteractionsScenarioContentRenderer({ GridInteractions }: GridInteractionsComponents) {
  const [intent, setIntent] = React.useState<GridInteractionIntent | undefined>();
  return (
    <GridInteractions
      items={items}
      selectedIds={intent?.itemIds}
      viewport={viewport}
      onIntent={setIntent}
    >
      <View style={{ height: viewport.height, width: viewport.width }} />
    </GridInteractions>
  );
}

interface GridInteractionsComponents {
  readonly GridInteractions: React.ComponentType<GridInteractionsScenarioProps>;
}

interface GridInteractionIntent {
  readonly itemIds: readonly string[];
}

interface GridInteractionsScenarioProps {
  readonly children: React.ReactNode;
  readonly items: readonly (typeof items)[number][];
  readonly selectedIds: readonly string[] | undefined;
  readonly viewport: typeof viewport;
  readonly onIntent: (intent: GridInteractionIntent) => void;
}
