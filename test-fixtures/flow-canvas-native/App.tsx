import { useState } from 'react';
import { Text, View } from 'react-native';

import { FlowCanvas } from '@ankhorage/zora/flow';

const initialNodes = [
  {
    id: 'source',
    ports: [{ direction: 'output' as const, id: 'out', label: 'Output' }],
    position: { x: 32, y: 120 },
    title: 'Source task',
  },
  {
    id: 'target',
    ports: [{ direction: 'input' as const, id: 'in', label: 'Input' }],
    position: { x: 300, y: 220 },
    title: 'Target task',
  },
];

/** Host the packed public FlowCanvas API with observable, caller-owned acceptance state. */
export default function App() {
  const [connections, setConnections] = useState([
    {
      id: 'source-target',
      source: { nodeId: 'source', portId: 'out' },
      target: { nodeId: 'target', portId: 'in' },
    },
  ]);
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeIds, setSelectedNodeIds] = useState<readonly string[]>([]);
  const [viewport, setViewport] = useState({ pan: { x: 0, y: 0 }, zoom: 1 });
  const [history, setHistory] = useState<readonly string[]>([]);
  const record = (event: string) => setHistory((current) => [...current, event]);

  return (
    <View style={{ flex: 1 }}>
      <Text accessibilityLabel="Flow acceptance state" testID="flow-acceptance-state">
        {JSON.stringify({ connections: connections.length, history, nodes, viewport })}
      </Text>
      <FlowCanvas
        canRedo
        canUndo
        connections={connections}
        nodes={nodes}
        paletteItems={[{ id: 'task', title: 'Insert task' }]}
        selectedNodeIds={selectedNodeIds}
        testID="flow-canvas"
        viewport={viewport}
        onConnect={(source, target) => {
          setConnections([{ id: 'source-target', source, target }]);
          record('connect');
        }}
        onDisconnect={(id) => {
          setConnections((current) => current.filter((connection) => connection.id !== id));
          record('disconnect');
        }}
        onInsert={(id) => record(`insert:${id}`)}
        onNodeSelectionChange={(nodeIds) => {
          setSelectedNodeIds(nodeIds);
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
    </View>
  );
}
