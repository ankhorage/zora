import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { GraphViewController, GraphViewElementEvent } from '../src/types/graph-view';
import { GraphView } from '../src/features/graph-view/adapters/inbound/web-artifact/GraphView';

interface GraphAcceptanceState {
  readonly events: readonly GraphViewElementEvent[];
  readonly layoutSorts: number;
  readonly layoutCompletions: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly ready: boolean;
  readonly selected: boolean;
  readonly viewport: ReturnType<GraphViewController['getViewport']> | null;
}

declare global {
  interface Window {
    graphAcceptance?: {
      read(): GraphAcceptanceState;
    };
  }
}

const state = {
  controller: null as GraphViewController | null,
  events: [] as GraphViewElementEvent[],
  layoutCompletions: 0,
  layoutSorts: 0,
  ready: false,
  selected: false,
};

const edges = [{ id: 'src-dependency', source: 'src', target: 'dependency' }];
const layoutOptions = {
  boundingBox: { x1: 0, y1: 0, w: 960, h: 720 },
  sort: () => {
    state.layoutSorts += 1;
    return 0;
  },
};
const nodes = [
  { id: 'src', label: 'src' },
  { id: 'dependency', label: 'dependency' },
];
const styleRules = [
  {
    selector: 'node',
    style: {
      'background-color': '#334155',
      'border-width': 2,
      color: '#ffffff',
      'font-size': 16,
      label: 'data(label)',
      padding: 12,
    },
  },
  { selector: 'node:selected', style: { 'outline-color': '#f97316', 'outline-width': 3 } },
];

/*** Mount the real canvas fixture used by the Chromium GraphView acceptance command. */
function GraphViewChromiumAcceptance() {
  const [selectedNodeIds, setSelectedNodeIds] = useState<readonly string[]>([]);
  const [, setVersion] = useState(0);
  const graphNodes = selectedNodeIds.includes('src')
    ? [{ id: 'src', label: 'src', classes: 'selected' }, nodes[1]!]
    : nodes;
  useEffect(() => {
    state.selected = selectedNodeIds.includes('src');
  }, [selectedNodeIds]);
  useEffect(() => {
    window.graphAcceptance = {
      read: () => {
        const controller = state.controller;
        return {
          events: state.events,
          layoutCompletions: state.layoutCompletions,
          layoutSorts: state.layoutSorts,
          measurement: controller?.measureNodes?.(['src']) ?? null,
          ready: state.ready,
          selected: state.selected,
          viewport: controller?.getViewport() ?? null,
        };
      },
    };
    return () => {
      delete window.graphAcceptance;
    };
  }, []);

  return (
    <GraphView
      edges={edges}
      layout="grid"
      layoutOptions={layoutOptions}
      nodes={graphNodes}
      onLayoutComplete={() => {
        state.layoutCompletions += 1;
        setVersion((version) => version + 1);
      }}
      onNodeEvent={(event) => {
        state.events.push(event);
        if (event.id === 'src' && event.type === 'press') setSelectedNodeIds(['src']);
      }}
      onReady={(controller) => {
        state.controller = controller;
        state.ready = true;
        setVersion((version) => version + 1);
      }}
      selectedNodeIds={selectedNodeIds}
      sizeNodesToLabels
      style={{ height: 720, width: 960 }}
      styleRules={styleRules}
    />
  );
}

document.body.style.margin = '0';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(<GraphViewChromiumAcceptance />);
