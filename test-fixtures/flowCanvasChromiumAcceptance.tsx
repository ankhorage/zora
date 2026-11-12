import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { FlowCanvas } from '@ankhorage/zora/flow';

type FlowState = Readonly<{
  readonly connections: number;
  readonly events: readonly string[];
  readonly nodes: readonly { readonly id: string; readonly x: number; readonly y: number }[];
  readonly selected: readonly string[];
  readonly viewport: {
    readonly pan: { readonly x: number; readonly y: number };
    readonly zoom: number;
  };
}>;

declare global {
  interface Window {
    flowAcceptance?: { read(): FlowState };
  }
}

const initialNodes = [
  {
    id: 'source',
    ports: [{ direction: 'output' as const, id: 'out', label: 'Source output' }],
    position: { x: 48, y: 96 },
    title: 'Source',
  },
  {
    description:
      'This deliberately long description proves that measured ports do not assume a fixed node height.',
    id: 'target',
    ports: [{ direction: 'input' as const, id: 'in', label: 'Target input' }],
    position: { x: 420, y: 238 },
    title: 'Target',
  },
];

/*** Host the public FlowCanvas boundary with caller-owned state for Chromium acceptance. */
function FlowCanvasChromiumAcceptance() {
  const [connections, setConnections] = useState<
    readonly {
      id: string;
      source: { nodeId: string; portId: string };
      target: { nodeId: string; portId: string };
    }[]
  >([
    {
      id: 'source-target',
      source: { nodeId: 'source', portId: 'out' },
      target: { nodeId: 'target', portId: 'in' },
    },
  ]);
  const [events, setEvents] = useState<readonly string[]>([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [viewport, setViewport] = useState({ pan: { x: 0, y: 0 }, zoom: 1 });
  useEffect(() => {
    window.flowAcceptance = {
      read: () => ({
        connections: connections.length,
        events,
        nodes: nodes.map((node) => ({ id: node.id, x: node.position.x, y: node.position.y })),
        selected,
        viewport,
      }),
    };
    return () => {
      delete window.flowAcceptance;
    };
  }, [connections, events, nodes, selected, viewport]);
  const record = (event: string) => setEvents((current) => [...current, event]);
  return (
    <FlowCanvas
      canRedo
      canUndo
      connections={connections}
      nodes={nodes}
      paletteItems={[{ id: 'task', title: 'Insert task' }]}
      selectedNodeIds={selected}
      testID="flow-canvas"
      viewport={viewport}
      onConnect={(source, target) => {
        setConnections([{ id: 'source-target', source, target }]);
        record('connect');
      }}
      onDisconnect={() => {
        setConnections([]);
        record('disconnect');
      }}
      onInsert={() => {
        record('insert');
      }}
      onNodeSelectionChange={(nodeIds) => {
        setSelected(nodeIds);
        record(`select:${nodeIds.join(',')}`);
      }}
      onNodesMove={(next) => {
        setNodes(next);
        record('move');
      }}
      onRedo={() => record('redo')}
      onUndo={() => record('undo')}
      onViewportChange={(next) => {
        setViewport(next);
        record('viewport');
      }}
    />
  );
}

document.body.style.margin = '0';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(<FlowCanvasChromiumAcceptance />);
