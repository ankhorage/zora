import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { GraphViewController, GraphViewElementEvent } from '../src/types/graph-view';
import { GraphView } from '../src/features/graph-view/adapters/inbound/web-artifact/GraphView';

interface GraphAcceptanceState {
  readonly events: readonly GraphViewElementEvent[];
  readonly layoutCompletions: number;
  readonly layoutCompleteEvents: number;
  readonly layoutSorts: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly narrowMeasurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly readyEvents: number;
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
  layoutCompleteEvents: 0,
  layoutSorts: 0,
  readyEvents: 0,
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
const narrowNodes = Array.from({ length: 5 }, (_, index) => ({
  id: `narrow-${index}`,
  label: `repository-${index}`,
}));
const narrowEdges = narrowNodes.slice(1).map((node, index) => ({
  id: `narrow-edge-${index}`,
  source: narrowNodes[index]!.id,
  target: node.id,
}));
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
  const [narrowController, setNarrowController] = useState<GraphViewController | null>(null);
  const lifecycleRef = useCallback((element: HTMLDivElement | null) => {
    if (element === null) return;
    element.addEventListener(GraphView.events.ready, (event) => {
      const controller = readGraphViewController(event);
      if (controller === null) return;
      state.controller = controller;
      state.readyEvents += 1;
      setVersion((version) => version + 1);
    });
    element.addEventListener(GraphView.events.layoutComplete, (event) => {
      const controller = readGraphViewController(event);
      if (controller === null) return;
      state.controller = controller;
      state.layoutCompleteEvents += 1;
      setVersion((version) => version + 1);
    });
  }, []);
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
          layoutCompleteEvents: state.layoutCompleteEvents,
          layoutSorts: state.layoutSorts,
          measurement: controller?.measureNodes?.(['src']) ?? null,
          narrowMeasurement:
            narrowController?.measureNodes?.(narrowNodes.map((node) => node.id)) ?? null,
          readyEvents: state.readyEvents,
          selected: state.selected,
          viewport: controller?.getViewport() ?? null,
        };
      },
    };
    return () => {
      delete window.graphAcceptance;
    };
  }, [narrowController]);

  return (
    <div>
      <div ref={lifecycleRef}>
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
          selectedNodeIds={selectedNodeIds}
          sizeNodesToLabels
          style={{ height: 720, width: 960 }}
          styleRules={styleRules}
        />
      </div>
      <GraphView
        edges={narrowEdges}
        layout="elk"
        maxFitLabelSize={24}
        maxZoom={2}
        minReadableLabelSize={24}
        minZoom={0.5}
        nodes={narrowNodes}
        sizeNodesToLabels
        style={{ height: 520, width: 38 }}
        styleRules={styleRules}
        zoomMode="fit-relative"
        onLayoutComplete={setNarrowController}
      />
    </div>
  );
}

/*** Read the controller only from the public bubbling GraphView lifecycle event payload. */
function readGraphViewController(event: Event): GraphViewController | null {
  if (!(event instanceof CustomEvent)) return null;
  const detail = event.detail;
  if (typeof detail !== 'object' || detail === null || !('controller' in detail)) return null;
  const { controller } = detail;
  return isGraphViewController(controller) ? controller : null;
}

/*** Narrow the event payload to the public GraphView controller API. */
function isGraphViewController(value: unknown): value is GraphViewController {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getViewport' in value &&
    typeof value.getViewport === 'function' &&
    'measureNodes' in value &&
    typeof value.measureNodes === 'function'
  );
}

document.body.style.margin = '0';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(<GraphViewChromiumAcceptance />);
