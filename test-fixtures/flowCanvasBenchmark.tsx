import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { FlowCanvas } from '@ankhorage/zora/flow';

type GraphSize = 25 | 200 | 1000;

const graphSizes: readonly GraphSize[] = [25, 200, 1000];

/** Generate a deterministic connected graph with varied labels and port layouts. */
function createGraph(size: GraphSize) {
  const nodes = Array.from({ length: size }, (_, index) => ({
    description: index % 3 === 0 ? `Measured description ${index}` : undefined,
    id: `node-${index}`,
    ports: [
      ...(index > 0 ? [{ direction: 'input' as const, id: 'in', label: 'In' }] : []),
      ...(index < size - 1 ? [{ direction: 'output' as const, id: 'out', label: 'Out' }] : []),
    ],
    position: { x: 24 + (index % 20) * 260, y: 72 + Math.floor(index / 20) * 168 },
    title: `Flow task ${index}`,
  }));
  return {
    connections: nodes.slice(1).map((node, index) => ({
      id: `edge-${index}`,
      source: { nodeId: `node-${index}`, portId: 'out' },
      target: { nodeId: node.id, portId: 'in' },
    })),
    nodes,
  };
}

/** Mount one actual public FlowCanvas graph chosen by the benchmark query string. */
function FlowCanvasBenchmark() {
  const size = Number(new URLSearchParams(location.search).get('size')) as GraphSize;
  const graph = createGraph(graphSizes.includes(size) ? size : 25);
  const [nodes, setNodes] = useState(graph.nodes);
  const [viewport, setViewport] = useState({ pan: { x: 0, y: 0 }, zoom: 1 });
  return (
    <FlowCanvas
      connections={graph.connections}
      nodes={nodes}
      testID="flow-benchmark"
      viewport={viewport}
      onNodesMove={setNodes}
      onViewportChange={setViewport}
    />
  );
}

document.body.style.margin = '0';
createRoot(document.body.appendChild(document.createElement('div'))).render(
  <FlowCanvasBenchmark />,
);
