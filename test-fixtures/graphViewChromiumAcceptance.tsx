import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { GraphView } from '@ankhorage/zora/web/graph-view';
import type { GraphViewController, GraphViewElementEvent } from '@ankhorage/zora/web/graph-view';

interface ScenarioState {
  readonly controllerChanges: number;
  readonly layoutCompletions: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly repositoryIds: readonly string[];
  readonly selectedRepositoryIds: readonly string[];
  readonly selectionTransitions: number;
  readonly viewport: ReturnType<GraphViewController['getViewport']> | null;
}

interface ProgressiveScenarioState {
  readonly layoutCompletions: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly readyCount: number;
  readonly repositoryIds: readonly string[];
}

interface InteractionScenarioState {
  readonly domPointerModifiers: readonly { readonly ctrlKey: boolean; readonly metaKey: boolean }[];
  readonly events: readonly GraphViewElementEvent[];
  readonly layoutCompletions: number;
  readonly layoutSorts: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly narrowMeasurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly readyCount: number;
  readonly selected: boolean;
  readonly viewport: ReturnType<GraphViewController['getViewport']> | null;
}

declare global {
  interface Window {
    graphAcceptance?: {
      fit(repositoryCount: number): void;
      read(repositoryCount: number): ScenarioState | null;
      readInteraction(): InteractionScenarioState | null;
      readProgressive(): ProgressiveScenarioState | null;
      remove(repositoryCount: number): void;
      restore(repositoryCount: number): void;
      reselect(repositoryCount: number): void;
      setViewport(
        repositoryCount: number,
        viewport: {
          readonly pan: { readonly x: number; readonly y: number };
          readonly zoom: number;
        },
      ): void;
    };
  }
}

const repositoryCounts = [5, 20, 87] as const;
const controllers = new Map<number, GraphViewController>();
const controllerChanges = new Map<number, number>();
const scenarioActions = new Map<
  number,
  {
    fit(): void;
    read(): ScenarioState;
    remove(): void;
    restore(): void;
    reselect(): void;
    setViewport(viewport: {
      readonly pan: { readonly x: number; readonly y: number };
      readonly zoom: number;
    }): void;
  }
>();
const elkLayoutOptions = { 'elk.algorithm': 'layered' };
const progressiveRepositories = createRepositories(5);
const interactionEdges = [{ id: 'src-dependency', source: 'src', target: 'dependency' }];
const interactionNodes = [
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
const interactionLayoutState = { layoutSorts: 0 };
const interactionLayoutOptions = {
  boundingBox: { x1: 0, y1: 0, w: 960, h: 720 },
  sort: () => {
    interactionLayoutState.layoutSorts += 1;
    return 0;
  },
};
let progressiveScenarioAction: { readonly read: () => ProgressiveScenarioState } | null = null;
let interactionScenarioAction: { readonly read: () => InteractionScenarioState } | null = null;

/*** Render the real compound ELK graphs used by the Chromium stable-topology acceptance. */
function GraphViewChromiumAcceptance() {
  useEffect(() => {
    window.graphAcceptance = {
      fit: (repositoryCount) => scenarioActions.get(repositoryCount)?.fit(),
      read: (repositoryCount) => scenarioActions.get(repositoryCount)?.read() ?? null,
      readInteraction: () => interactionScenarioAction?.read() ?? null,
      readProgressive: () => progressiveScenarioAction?.read() ?? null,
      remove: (repositoryCount) => scenarioActions.get(repositoryCount)?.remove(),
      restore: (repositoryCount) => scenarioActions.get(repositoryCount)?.restore(),
      reselect: (repositoryCount) => scenarioActions.get(repositoryCount)?.reselect(),
      setViewport: (repositoryCount, viewport) =>
        scenarioActions.get(repositoryCount)?.setViewport(viewport),
    };
    return () => {
      delete window.graphAcceptance;
    };
  }, []);

  return (
    <div>
      <InteractionScenario />
      {repositoryCounts.map((repositoryCount) => (
        <StableTopologyScenario key={repositoryCount} repositoryCount={repositoryCount} />
      ))}
      <ProgressiveInitialLayoutScenario />
    </div>
  );
}

/*** Exercise native canvas input without allowing selection paint to restart layout. */
function InteractionScenario() {
  const [controller, setController] = useState<GraphViewController | null>(null);
  const [domPointerModifiers, setDomPointerModifiers] = useState<
    readonly { readonly ctrlKey: boolean; readonly metaKey: boolean }[]
  >([]);
  const [events, setEvents] = useState<readonly GraphViewElementEvent[]>([]);
  const [layoutCompletions, setLayoutCompletions] = useState(0);
  const [narrowController, setNarrowController] = useState<GraphViewController | null>(null);
  const [readyCount, setReadyCount] = useState(0);
  const [selectedNodeIds, setSelectedNodeIds] = useState<readonly string[]>([]);
  const nodes = interactionNodes.map((node) =>
    selectedNodeIds.includes(node.id) ? { ...node, classes: 'selected' } : node,
  );
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      setDomPointerModifiers((current) => [
        ...current,
        { ctrlKey: event.ctrlKey, metaKey: event.metaKey },
      ]);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);
  interactionScenarioAction = {
    read: () => ({
      domPointerModifiers,
      events,
      layoutCompletions,
      layoutSorts: interactionLayoutState.layoutSorts,
      measurement: controller?.measureNodes?.(['src', 'dependency']) ?? null,
      narrowMeasurement:
        narrowController?.measureNodes?.(narrowNodes.map((node) => node.id)) ?? null,
      readyCount,
      selected: selectedNodeIds.includes('src'),
      selectedNodeIds,
      viewport: controller?.getViewport() ?? null,
    }),
  };

  return (
    <div>
      <GraphView
        edges={interactionEdges}
        layout="grid"
        layoutOptions={interactionLayoutOptions}
        nodes={nodes}
        onLayoutComplete={() => setLayoutCompletions((count) => count + 1)}
        onNodeEvent={(event) => {
          setEvents((current) => [...current, event]);
          if (event.type !== 'press') return;
          setSelectedNodeIds((current) =>
            event.selectionIntent === 'toggle'
              ? current.includes(event.id)
                ? current.filter((id) => id !== event.id)
                : [...current, event.id]
              : [event.id],
          );
        }}
        onReady={(nextController) => {
          setController(nextController);
          setReadyCount((count) => count + 1);
        }}
        selectedNodeIds={selectedNodeIds}
        sizeNodesToLabels
        style={{ height: 720, width: 960 }}
        styleRules={styleRules}
      />
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

/*** Exercise 0 → 1 → 5 nodes before the first compound ELK layout settles. */
function ProgressiveInitialLayoutScenario() {
  const [visibleRepositoryIds, setVisibleRepositoryIds] = useState<readonly string[]>([]);
  const [layoutCompletions, setLayoutCompletions] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [controller, setController] = useState<GraphViewController | null>(null);
  const visibleRepositories = progressiveRepositories.filter((node) =>
    visibleRepositoryIds.includes(node.id),
  );
  const repositoryIds = visibleRepositories.map((node) => node.id);
  const nodes = [
    { id: 'progressive-group-even', label: 'even repositories' },
    { id: 'progressive-group-odd', label: 'odd repositories' },
    ...visibleRepositories.map((node) => ({
      ...node,
      parentId: node.parentId === 'group-even' ? 'progressive-group-even' : 'progressive-group-odd',
    })),
  ];
  const edges = visibleRepositories.slice(1).map((node, index) => ({
    id: `progressive-dependency-${index}`,
    source: visibleRepositories[index]!.id,
    target: node.id,
  }));

  useEffect(() => {
    setVisibleRepositoryIds([progressiveRepositories[0]!.id]);
    requestAnimationFrame(() =>
      setVisibleRepositoryIds(progressiveRepositories.map((node) => node.id)),
    );
  }, []);
  progressiveScenarioAction = {
    read: () => ({
      layoutCompletions,
      measurement: controller?.measureNodes?.(repositoryIds) ?? null,
      readyCount,
      repositoryIds,
    }),
  };

  return (
    <GraphView
      edges={edges}
      layout="elk"
      layoutOptions={elkLayoutOptions}
      nodes={nodes}
      sizeNodesToLabels
      style={{ height: 360, width: 960 }}
      styleRules={styleRules}
      topologyUpdatePolicy="preserve-positions"
      onLayoutComplete={() => setLayoutCompletions((count) => count + 1)}
      onReady={(nextController) => {
        setController(nextController);
        setReadyCount((count) => count + 1);
      }}
    />
  );
}

/*** Exercise one independently mounted, compound ELK GraphView at a production-scale count. */
function StableTopologyScenario({ repositoryCount }: { readonly repositoryCount: number }) {
  const repositories = createRepositories(repositoryCount);
  const [visibleRepositoryIds, setVisibleRepositoryIds] = useState(
    repositories.map((node) => node.id),
  );
  const [layoutCompletions, setLayoutCompletions] = useState(0);
  const [selectedRepositoryIds, setSelectedRepositoryIds] = useState<readonly string[]>([
    'repository-0',
  ]);
  const [selectionTransitions, setSelectionTransitions] = useState(0);
  const visibleRepositories = repositories.filter((node) => visibleRepositoryIds.includes(node.id));
  const repositoryIds = visibleRepositories.map((node) => node.id);
  const nodes = [
    { id: 'group-even', label: 'even repositories' },
    { id: 'group-odd', label: 'odd repositories' },
    ...visibleRepositories,
  ];
  const edges = visibleRepositories.slice(1).map((node, index) => ({
    id: `dependency-${index}`,
    source: visibleRepositories[index]!.id,
    target: node.id,
  }));
  const controller = controllers.get(repositoryCount) ?? null;
  scenarioActions.set(repositoryCount, {
    fit: () => controller?.fit(),
    read: () => {
      const currentController = controllers.get(repositoryCount);
      return {
        controllerChanges: controllerChanges.get(repositoryCount) ?? 0,
        layoutCompletions,
        measurement: currentController?.measureNodes?.(repositoryIds) ?? null,
        repositoryIds,
        selectedRepositoryIds,
        selectionTransitions,
        viewport: currentController?.getViewport() ?? null,
      };
    },
    remove: () => setVisibleRepositoryIds((ids) => ids.slice(0, -1)),
    reselect: () => {
      setSelectedRepositoryIds([]);
      setSelectionTransitions((count) => count + 1);
      requestAnimationFrame(() => {
        setSelectedRepositoryIds(['repository-0']);
        setSelectionTransitions((count) => count + 1);
      });
    },
    restore: () => setVisibleRepositoryIds(repositories.map((node) => node.id)),
    setViewport: (viewport) => {
      controller?.setZoom(viewport.zoom);
      controller?.setPan(viewport.pan);
    },
  });
  return (
    <div data-graph-scenario={repositoryCount}>
      <GraphView
        edges={edges}
        layout="elk"
        layoutOptions={elkLayoutOptions}
        nodes={nodes}
        selectedNodeIds={selectedRepositoryIds}
        sizeNodesToLabels
        style={{ height: 360, width: 960 }}
        styleRules={styleRules}
        topologyUpdatePolicy="preserve-positions"
        onLayoutComplete={() => setLayoutCompletions((count) => count + 1)}
        onReady={(nextController) => {
          const previous = controllers.get(repositoryCount);
          if (previous !== undefined && previous !== nextController)
            controllerChanges.set(
              repositoryCount,
              (controllerChanges.get(repositoryCount) ?? 0) + 1,
            );
          controllers.set(repositoryCount, nextController);
        }}
      />
    </div>
  );
}

/*** Build a two-compound repository topology with stable IDs and deterministic edge membership. */
function createRepositories(repositoryCount: number) {
  return Array.from({ length: repositoryCount }, (_, index) => ({
    id: `repository-${index}`,
    label: `repository-${index}`,
    parentId: index % 2 === 0 ? 'group-even' : 'group-odd',
  }));
}

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

document.body.style.margin = '0';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(<GraphViewChromiumAcceptance />);
