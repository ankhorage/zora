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

test('rejects an output and input whose published Contracts schema types do not overlap', () => {
  const connections: { readonly source: string; readonly target: string }[] = [];
  const source = nodes.find((node) => node.id === 'source');
  const target = nodes.find((node) => node.id === 'target');
  if (!source || !target) throw new Error('The typed-port test requires source and target nodes.');
  const controller = createFlowEditorController(
    createProps({
      nodes: [
        {
          ...source,
          ports: [
            {
              data: { schema: { type: 'string' } },
              direction: 'output',
              id: 'out',
              label: 'Text output',
            },
          ],
        },
        {
          ...target,
          ports: [
            {
              data: { schema: { type: 'number' } },
              direction: 'input',
              id: 'in',
              label: 'Number input',
            },
          ],
        },
      ],
      onConnect: (connectionSource, connectionTarget) =>
        connections.push({ source: connectionSource.portId, target: connectionTarget.portId }),
    }),
  );

  expect(
    controller.connect({ nodeId: 'source', portId: 'out' }, { nodeId: 'target', portId: 'in' }),
  ).toBe('connection_types_incompatible');
  expect(connections).toEqual([]);
});

test('suppresses mutation intents in read-only mode', () => {
  const deleted: string[][] = [];
  const moved: (readonly FlowNodeData[])[] = [];
  const selected: string[][] = [];
  const controller = createFlowEditorController(
    createProps({
      onNodeSelectionChange: (ids) => selected.push([...ids]),
      onNodesMove: (next) => {
        moved.push(next);
      },
      onNodesDelete: (ids) => deleted.push([...ids]),
      readOnly: true,
    }),
  );

  controller.selectNode('source');
  controller.moveNode('source', { x: 3, y: -2 });
  controller.deleteNodes(['source']);

  expect(selected).toEqual([]);
  expect(moved).toEqual([]);
  expect(deleted).toEqual([]);
});

test('deletes only enabled selected nodes through the controlled host', () => {
  const deleted: string[][] = [];
  const controller = createFlowEditorController(
    createProps({ onNodesDelete: (ids) => deleted.push([...ids]) }),
  );

  controller.deleteNodes(['source']);
  controller.deleteNodes([]);
  controller.deleteNodes(['missing']);

  expect(deleted).toEqual([['source']]);
});
