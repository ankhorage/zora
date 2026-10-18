import { worldToViewport } from '@ankhorage/grid-view';
import React from 'react';
import { Text, View } from 'react-native';

import { ResponsiveWidth } from '../ResponsiveWidth';

const initialViewport = {
  height: 320,
  offsetX: 0,
  offsetY: 0,
  pixelsPerUnitX: 1,
  pixelsPerUnitY: 1,
  width: 480,
};

const initialItems = [
  { height: 80, id: 'first', width: 120, x: 40, y: 40 },
  { height: 80, id: 'second', width: 120, x: 220, y: 140 },
] as const;

/** Demonstrates composing controlled interactions around any caller-owned item presentation. */
export function GridInteractionsScenario() {
  return (
    <React.Suspense fallback={null}>
      <ResponsiveWidth maxWidth={initialViewport.width}>
        {(width) => <GridInteractionsScenarioContent width={width} />}
      </ResponsiveWidth>
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
    default: ({ width }: { readonly width: number }) => (
      <GridInteractionsScenarioContentRenderer
        GridInteractions={zora.GridInteractions}
        width={width}
      />
    ),
  };
});

/** Checks the installed public package surface before rendering the independently released feature. */
function hasGridInteractions(value: object): value is GridInteractionsComponents {
  return 'GridInteractions' in value && typeof value.GridInteractions === 'function';
}

/** Renders the scenario through the released public package instead of local repository source. */
function GridInteractionsScenarioContentRenderer({
  GridInteractions,
  width,
}: GridInteractionsComponents & { readonly width: number }) {
  const [items, setItems] = React.useState<readonly GridInteractionItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>([]);
  const [viewportState, setViewport] = React.useState(initialViewport);
  const viewport = React.useMemo(() => ({ ...viewportState, width }), [viewportState, width]);

  const handleIntent = (nextIntent: GridInteractionIntent) => {
    if (
      nextIntent.type === 'select' ||
      nextIntent.type === 'marquee' ||
      nextIntent.type === 'move'
    ) {
      setSelectedIds(nextIntent.itemIds);
    }
    if (nextIntent.rects !== undefined) {
      setItems((currentItems) =>
        currentItems.map((item) => nextIntent.rects?.find((rect) => rect.id === item.id) ?? item),
      );
    }
    if (nextIntent.viewport !== undefined) setViewport(nextIntent.viewport);
  };

  return (
    <View>
      <Text>
        Drag an item to move it, drag empty space to marquee-select, hold Space while dragging to
        pan, or use arrow keys to move the selected item. Hold Alt with arrow keys to resize it.
      </Text>
      <GridInteractions
        items={items}
        selectedIds={selectedIds}
        viewport={viewport}
        onIntent={handleIntent}
      >
        <View
          style={{
            backgroundColor: '#e2e8f0',
            height: viewport.height,
            overflow: 'hidden',
            position: 'relative',
            width: viewport.width,
          }}
        >
          {items.map((item) => {
            const position = worldToViewport({ x: item.x, y: item.y }, viewport);
            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: selectedIds.includes(item.id) ? '#2563eb' : '#64748b',
                  height: item.height * viewport.pixelsPerUnitY,
                  left: position.x,
                  padding: 8,
                  position: 'absolute',
                  top: position.y,
                  width: item.width * viewport.pixelsPerUnitX,
                }}
                testID={`grid-interaction-item-${item.id}`}
              >
                <Text style={{ color: '#ffffff' }}>{item.id}</Text>
              </View>
            );
          })}
        </View>
      </GridInteractions>
    </View>
  );
}

interface GridInteractionsComponents {
  readonly GridInteractions: React.ComponentType<GridInteractionsScenarioProps>;
}

interface GridInteractionIntent {
  readonly itemIds: readonly string[];
  readonly type: 'marquee' | 'move' | 'pan' | 'resize' | 'select';
  readonly rects?: readonly GridInteractionItem[];
  readonly viewport?: typeof initialViewport;
}

interface GridInteractionItem {
  readonly height: number;
  readonly id: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

interface GridInteractionsScenarioProps {
  readonly children: React.ReactNode;
  readonly items: readonly GridInteractionItem[];
  readonly selectedIds: readonly string[] | undefined;
  readonly viewport: typeof initialViewport;
  readonly onIntent: (intent: GridInteractionIntent) => void;
}
