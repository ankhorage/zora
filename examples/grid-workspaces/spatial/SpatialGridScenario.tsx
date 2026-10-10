import React from 'react';
import { Text, View } from 'react-native';

const spatialItems = Array.from({ length: 10000 }, (_, index) => ({
  accessibilityLabel: `Board item ${index + 1}`,
  height: 48 + (index % 4) * 16,
  id: `spatial-${index}`,
  width: 72 + (index % 5) * 20,
  x: (index % 100) * 140 + (index % 3) * 11,
  y: Math.floor(index / 100) * 110 + (index % 4) * 7,
  zIndex: index % 7 === 0 ? 1 : 0,
}));

/** Exercises a 10k free-placement board with caller-owned selected and focused IDs. */
export function SpatialGridScenario() {
  const [selectedItemId, setSelectedItemId] = React.useState<string>();
  const [focusedItemId, setFocusedItemId] = React.useState<string>();

  return (
    <React.Suspense fallback={null}>
      <SpatialGridScenarioContent
        focusedItemId={focusedItemId}
        selectedItemId={selectedItemId}
        onFocusChange={setFocusedItemId}
        onSelectionChange={setSelectedItemId}
      />
    </React.Suspense>
  );
}

const SpatialGridScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasSpatialGrid(zora)) {
    throw new Error(
      'SpatialGridScenario requires a released @ankhorage/zora version with SpatialGrid.',
    );
  }
  return {
    default: (props: SpatialGridScenarioContentProps) => renderSpatialGridScenario(zora, props),
  };
});

/** Checks the installed public package surface before rendering the independently released feature. */
function hasSpatialGrid(value: object): value is SpatialGridComponents {
  return 'SpatialGrid' in value && typeof value.SpatialGrid === 'function';
}

/** Renders the scenario through the released public package instead of local repository source. */
function renderSpatialGridScenario(
  { SpatialGrid }: SpatialGridComponents,
  {
    focusedItemId,
    selectedItemId,
    onFocusChange,
    onSelectionChange,
  }: SpatialGridScenarioContentProps,
) {
  return (
    <SpatialGrid
      contentHeight={11000}
      contentWidth={14000}
      focusedItemId={focusedItemId}
      height={420}
      items={spatialItems}
      selectedItemId={selectedItemId}
      width={720}
      zoom={0.8}
      onFocusChange={onFocusChange}
      onSelectionChange={onSelectionChange}
      renderItem={(item, state) => (
        <View style={{ height: '100%', opacity: state.focused ? 1 : 0.86, width: '100%' }}>
          <Text>{state.selected ? `Selected ${item.id}` : item.id}</Text>
        </View>
      )}
    />
  );
}

interface SpatialGridScenarioContentProps {
  readonly selectedItemId: string | undefined;
  readonly focusedItemId: string | undefined;
  readonly onSelectionChange: (id: string) => void;
  readonly onFocusChange: (id: string) => void;
}

interface SpatialGridComponents {
  readonly SpatialGrid: React.ComponentType<SpatialGridScenarioProps>;
}

interface SpatialGridScenarioProps {
  readonly items: readonly (typeof spatialItems)[number][];
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly width: number;
  readonly height: number;
  readonly zoom: number;
  readonly selectedItemId: string | undefined;
  readonly focusedItemId: string | undefined;
  readonly onSelectionChange: (id: string) => void;
  readonly onFocusChange: (id: string) => void;
  readonly renderItem: (
    item: (typeof spatialItems)[number],
    state: { readonly selected: boolean; readonly focused: boolean },
  ) => React.ReactNode;
}
