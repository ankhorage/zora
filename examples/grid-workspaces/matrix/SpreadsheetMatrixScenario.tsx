import React from 'react';
import { Text } from 'react-native';

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
  return (
    <React.Suspense fallback={null}>
      <SpreadsheetMatrixScenarioContent />
    </React.Suspense>
  );
}

const SpreadsheetMatrixScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasMatrixGrid(zora)) {
    throw new Error('SpreadsheetMatrixScenario requires a released @ankhorage/zora MatrixGrid.');
  }
  return { default: () => renderSpreadsheetMatrixScenario(zora.MatrixGrid) };
});

/*** Verifies the installed public package exposes the code-first matrix component. */
function hasMatrixGrid(value: object): value is MatrixGridComponents {
  return 'MatrixGrid' in value && typeof value.MatrixGrid === 'function';
}

/*** Keeps the example coupled to the released public component instead of local source. */
function renderSpreadsheetMatrixScenario(MatrixGrid: React.ComponentType<Record<string, unknown>>) {
  return (
    <MatrixGrid
      cells={cells}
      height={320}
      layout={layout}
      renderCell={(cell: { id: string }) => <Text>{cell.id}</Text>}
      width={640}
    />
  );
}

interface MatrixGridComponents {
  readonly MatrixGrid: React.ComponentType<Record<string, unknown>>;
}
