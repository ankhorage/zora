import React from 'react';
import { Text, View } from 'react-native';

import { ResponsiveWidth } from '../ResponsiveWidth';

const layout = {
  columns: Array.from({ length: 24 }, (_, index) => ({ id: `column-${index}`, size: 96 })),
  rows: Array.from({ length: 100 }, (_, index) => ({ id: `row-${index}`, size: 32 })),
};

const cells = Array.from({ length: 2400 }, (_, index) => ({
  columnId: `column-${index % 24}`,
  id: `cell-${index}`,
  rowId: `row-${Math.floor(index / 24)}`,
}));

/*** Demonstrates a spreadsheet-like grid through the released code-first MatrixGrid API. */
export function SpreadsheetMatrixScenario() {
  const [selectedCellIds, setSelectedCellIds] = React.useState<readonly string[]>([]);

  return (
    <React.Suspense fallback={null}>
      <Text>{`Selected cells: ${selectedCellIds.length === 0 ? 'none' : selectedCellIds.join(', ')}`}</Text>
      <ResponsiveWidth maxWidth={640}>
        {(width) => (
          <SpreadsheetMatrixScenarioContent
            selectedCellIds={selectedCellIds}
            width={width}
            onSelectionChange={setSelectedCellIds}
          />
        )}
      </ResponsiveWidth>
    </React.Suspense>
  );
}

const SpreadsheetMatrixScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasMatrixGrid(zora)) {
    throw new Error('SpreadsheetMatrixScenario requires a released @ankhorage/zora MatrixGrid.');
  }
  return {
    default: (props: SpreadsheetMatrixScenarioContentProps) =>
      renderSpreadsheetMatrixScenario(zora.MatrixGrid, props),
  };
});

/*** Verifies the installed public package exposes the code-first matrix component. */
function hasMatrixGrid(value: object): value is MatrixGridComponents {
  return 'MatrixGrid' in value && typeof value.MatrixGrid === 'function';
}

/*** Keeps the example coupled to the released public component instead of local source. */
function renderSpreadsheetMatrixScenario(
  MatrixGrid: React.ComponentType<Record<string, unknown>>,
  { selectedCellIds, width, onSelectionChange }: SpreadsheetMatrixScenarioContentProps,
) {
  return (
    <MatrixGrid
      cells={cells}
      height={320}
      layout={layout}
      renderCell={(cell: { id: string }) => (
        <View
          style={{
            backgroundColor: selectedCellIds.includes(cell.id) ? '#bfdbfe' : 'transparent',
            flex: 1,
          }}
        >
          <Text>{cell.id}</Text>
        </View>
      )}
      selectedCellIds={selectedCellIds}
      selectionMode="multi"
      width={width}
      onSelectionChange={onSelectionChange}
    />
  );
}

interface SpreadsheetMatrixScenarioContentProps {
  readonly selectedCellIds: readonly string[];
  readonly width: number;
  readonly onSelectionChange: (ids: readonly string[]) => void;
}

interface MatrixGridComponents {
  readonly MatrixGrid: React.ComponentType<Record<string, unknown>>;
}
