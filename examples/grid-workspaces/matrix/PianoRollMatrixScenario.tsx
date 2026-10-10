import React from 'react';
import { View } from 'react-native';

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
  return (
    <React.Suspense fallback={null}>
      <PianoRollMatrixScenarioContent />
    </React.Suspense>
  );
}

const PianoRollMatrixScenarioContent = React.lazy(async () => {
  const zora = await import('@ankhorage/zora');
  if (!hasMatrixGrid(zora)) {
    throw new Error('PianoRollMatrixScenario requires a released @ankhorage/zora MatrixGrid.');
  }
  return { default: () => renderPianoRollMatrixScenario(zora.MatrixGrid) };
});

/*** Verifies the installed public package exposes the code-first matrix component. */
function hasMatrixGrid(value: object): value is MatrixGridComponents {
  return 'MatrixGrid' in value && typeof value.MatrixGrid === 'function';
}

/*** Keeps music-specific content outside the generic MatrixGrid implementation. */
function renderPianoRollMatrixScenario(MatrixGrid: React.ComponentType<Record<string, unknown>>) {
  return (
    <MatrixGrid
      cells={cells}
      height={320}
      layout={layout}
      renderCell={() => <View style={{ backgroundColor: '#7c3aed', flex: 1 }} />}
      width={640}
    />
  );
}

interface MatrixGridComponents {
  readonly MatrixGrid: React.ComponentType<Record<string, unknown>>;
}
