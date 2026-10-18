import React from 'react';
import { Text, View } from 'react-native';

import { ResponsiveWidth } from '../ResponsiveWidth';

const layout = {
  columns: Array.from({ length: 128 }, (_, index) => ({ id: `step-${index}`, size: 24 })),
  rows: Array.from({ length: 24 }, (_, index) => ({ id: `pitch-${index}`, size: 28 })),
};

const cells = Array.from({ length: 96 }, (_, index) => ({
  columnId: `step-${(index * 5) % 128}`,
  id: `note-${index}`,
  rowId: `pitch-${(index * 7) % 24}`,
}));

/*** Demonstrates a piano-roll/step-grid as a consumer scenario, without embedding a DAW domain. */
export function PianoRollMatrixScenario() {
  const [selectedCellIds, setSelectedCellIds] = React.useState<readonly string[]>([]);

  return (
    <React.Suspense fallback={null}>
      <Text>{`Selected notes: ${selectedCellIds.length}`}</Text>
      <ResponsiveWidth maxWidth={640}>
        {(width) => (
          <PianoRollMatrixScenarioContent
            selectedCellIds={selectedCellIds}
            width={width}
            onSelectionChange={setSelectedCellIds}
          />
        )}
      </ResponsiveWidth>
    </React.Suspense>
  );
}

const PianoRollMatrixScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasMatrixGrid(zora)) {
    throw new Error('PianoRollMatrixScenario requires a released @ankhorage/zora MatrixGrid.');
  }
  return {
    default: (props: PianoRollMatrixScenarioContentProps) =>
      renderPianoRollMatrixScenario(zora.MatrixGrid, props),
  };
});

/*** Verifies the installed public package exposes the code-first matrix component. */
function hasMatrixGrid(value: object): value is MatrixGridComponents {
  return 'MatrixGrid' in value && typeof value.MatrixGrid === 'function';
}

/*** Keeps music-specific content outside the generic MatrixGrid implementation. */
function renderPianoRollMatrixScenario(
  MatrixGrid: React.ComponentType<Record<string, unknown>>,
  { selectedCellIds, width, onSelectionChange }: PianoRollMatrixScenarioContentProps,
) {
  return (
    <MatrixGrid
      cells={cells}
      height={320}
      layout={layout}
      renderCell={(cell: { id: string }) => (
        <View
          style={{
            backgroundColor: selectedCellIds.includes(cell.id) ? '#f59e0b' : '#7c3aed',
            flex: 1,
          }}
        />
      )}
      selectedCellIds={selectedCellIds}
      selectionMode="multi"
      width={width}
      onSelectionChange={onSelectionChange}
    />
  );
}

interface PianoRollMatrixScenarioContentProps {
  readonly selectedCellIds: readonly string[];
  readonly width: number;
  readonly onSelectionChange: (ids: readonly string[]) => void;
}

interface MatrixGridComponents {
  readonly MatrixGrid: React.ComponentType<Record<string, unknown>>;
}
