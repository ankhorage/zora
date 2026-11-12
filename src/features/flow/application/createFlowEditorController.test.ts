import { expect, test } from 'bun:test';

import type { FlowCanvasProps, FlowNodeData } from '../../../types/flow';
import { createFlowEditorController } from './createFlowEditorController';

const nodes: readonly FlowNodeData[] = [
  {
    id: 'source',
    position: { x: 10, y: 20 },
    ports: [{ direction: 'output', id: 'out', label: 'Output' }],
    title: 'Source',
  },
  {
    id: 'target',
    position: { x: 40, y: 50 },
    ports: [{ direction: 'input', id: 'in', label: 'Input' }],
    title: 'Target',
  },
];

/** Create a minimal controlled editor contract for interaction assertions. */
function createProps(overrides: Partial<FlowCanvasProps> = {}): FlowCanvasProps {
  return {
    connections: [],
    nodes,
    viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
    ...overrides,
  };
}

test('emits controlled selection, movement and viewport updates', () => {
  const selected: string[][] = [];
  const moved: (readonly FlowNodeData[])[] = [];
  const viewports: FlowCanvasProps['viewport'][] = [];
  const controller = createFlowEditorController(
    createProps({
      onNodeSelectionChange: (ids) => selected.push([...ids]),
      onNodesMove: (next) => {
        moved.push(next);
      },
      onViewportChange: (viewport) => viewports.push(viewport),
    }),
  );

  controller.selectNode('source');
  controller.moveNode('source', { x: 3, y: -2 });
  controller.setViewport({ pan: { x: 4, y: 5 }, zoom: 1.25 });

  expect(selected).toEqual([['source']]);
  expect(moved[0]?.[0]?.position).toEqual({ x: 13, y: 18 });
  expect(viewports).toEqual([{ pan: { x: 4, y: 5 }, zoom: 1.25 }]);
});

test('connects only an enabled output to an input on a different node', () => {
  const connections: { readonly source: string; readonly target: string }[] = [];
  const controller = createFlowEditorController(
    createProps({
      onConnect: (source, target) =>
        connections.push({ source: source.portId, target: target.portId }),
    }),
  );

  controller.connect({ nodeId: 'source', portId: 'out' }, { nodeId: 'target', portId: 'in' });
  controller.connect({ nodeId: 'target', portId: 'in' }, { nodeId: 'source', portId: 'out' });

  expect(connections).toEqual([{ source: 'out', target: 'in' }]);
});

test('suppresses mutation intents in read-only mode', () => {
  const moved: (readonly FlowNodeData[])[] = [];
  const selected: string[][] = [];
  const controller = createFlowEditorController(
    createProps({
      onNodeSelectionChange: (ids) => selected.push([...ids]),
      onNodesMove: (next) => {
        moved.push(next);
      },
      readOnly: true,
    }),
  );

  controller.selectNode('source');
  controller.moveNode('source', { x: 3, y: -2 });

  expect(selected).toEqual([]);
  expect(moved).toEqual([]);
});
