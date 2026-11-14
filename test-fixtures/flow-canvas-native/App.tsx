import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const sourcePositionRef = useRef(initialNodes[0]!.position);
  const [sourceUnchangedOnViewportChange, setSourceUnchangedOnViewportChange] = useState(true);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const record = (event: string) => setHistory((current) => [...current, event]);
  const source = nodes.find((node) => node.id === 'source')!;
  const observedEvents = history.filter((event, index) => history.indexOf(event) === index);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View accessibilityLabel="Flow acceptance state" testID="flow-acceptance-state">
        <Text testID="flow-selection-state">selection={selectedNodeIds.join(',') || 'none'}</Text>
        <Text testID="flow-node-state">
          source-position={source.position.x},{source.position.y}
        </Text>
        <Text testID="flow-node-moved-state">
          source-moved={String(source.position.x !== 32 || source.position.y !== 120)}
        </Text>
        <Text testID="flow-viewport-state">
          viewport={viewport.pan.x},{viewport.pan.y},{viewport.zoom}
        </Text>
        <Text testID="flow-viewport-pan-state">
          viewport-panned={String(viewport.pan.x !== 0 || viewport.pan.y !== 0)}
        </Text>
        <Text testID="flow-node-viewport-state">
          source-unchanged-on-viewport-change={String(sourceUnchangedOnViewportChange)}
        </Text>
        <Text testID="flow-connection-state">connections={connections.length}</Text>
        <Text testID="flow-undo-state">undo-count={undoCount}</Text>
        <Text testID="flow-redo-state">redo-count={redoCount}</Text>
        {observedEvents.map((event, index) => (
          <Text key={`${event}-${index}`}>event={event}</Text>
        ))}
      </View>
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
          sourcePositionRef.current = next.find((node) => node.id === 'source')!.position;
          record('move');
        }}
        onRedo={() => {
          setRedoCount((current) => current + 1);
          record('redo');
        }}
        onUndo={() => {
          setUndoCount((current) => current + 1);
          record('undo');
        }}
        onViewportChange={(next) => {
          setSourceUnchangedOnViewportChange(
            source.position.x === sourcePositionRef.current.x &&
              source.position.y === sourcePositionRef.current.y,
          );
          setViewport(next);
          record('viewport');
        }}
      />
    </SafeAreaView>
  );
}
