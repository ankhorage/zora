import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import type { GraphViewController } from '../src/types/graph-view';
import { GraphView } from '../src/features/graph-view/adapters/inbound/web-artifact/GraphView';

interface ScenarioState {
  readonly controllerChanges: number;
  readonly layoutCompletions: number;
  readonly measurement: ReturnType<NonNullable<GraphViewController['measureNodes']>>;
  readonly repositoryIds: readonly string[];
  readonly selectedRepositoryIds: readonly string[];
  readonly selectionTransitions: number;
  readonly viewport: ReturnType<GraphViewController['getViewport']> | null;
}

declare global {
  interface Window {
    graphAcceptance?: {
      fit(repositoryCount: number): void;
      read(repositoryCount: number): ScenarioState | null;
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

/*** Render the real compound ELK graphs used by the Chromium stable-topology acceptance. */
function GraphViewChromiumAcceptance() {
  useEffect(() => {
    window.graphAcceptance = {
      fit: (repositoryCount) => scenarioActions.get(repositoryCount)?.fit(),
      read: (repositoryCount) => scenarioActions.get(repositoryCount)?.read() ?? null,
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
      {repositoryCounts.map((repositoryCount) => (
        <StableTopologyScenario key={repositoryCount} repositoryCount={repositoryCount} />
      ))}
    </div>
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
