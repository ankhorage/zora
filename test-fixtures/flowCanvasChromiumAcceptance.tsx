import type { FlowNode, FlowNodeConfigValue } from '@ankhorage/contracts/flow';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { FlowExecutionOverlay } from '@ankhorage/zora/web/flow-execution-overlay';
import { FlowInspector } from '@ankhorage/zora/web/flow-inspector';
import { FlowNodePalette } from '@ankhorage/zora/web/flow-node-palette';
import { ZoraProvider } from '@ankhorage/zora/web/runtime';
import {
  FlowCanvas,
  type FlowConnection,
  type FlowNodeData,
  type FlowViewport,
} from '@ankhorage/zora/flow';

type EditorState = Readonly<{
  readonly connections: readonly FlowConnection[];
  readonly configs: Readonly<
    Record<string, Readonly<Record<string, FlowNodeConfigValue | undefined>>>
  >;
  readonly nodes: readonly FlowNodeData[];
  readonly rejection: string | null;
  readonly selectedNodeId: string | null;
  readonly viewport: FlowViewport;
}>;

type FlowState = Readonly<{
  readonly approval: 'not_required' | 'pending';
  readonly connections: number;
  readonly events: readonly string[];
  readonly nodeMoveChanges: number;
  readonly nodes: readonly { readonly id: string; readonly x: number; readonly y: number }[];
  readonly rejection: string | null;
  readonly selected: readonly string[];
  readonly undoDepth: number;
  readonly viewport: FlowViewport;
}>;

type EditorHistory = Readonly<{
  readonly current: EditorState;
  readonly future: readonly EditorState[];
  readonly past: readonly EditorState[];
}>;

declare global {
  interface Window {
    flowAcceptance?: { read(): FlowState };
  }
}

const INITIAL_EDITOR: EditorState = {
  configs: {},
  connections: [],
  nodes: [],
  rejection: null,
  selectedNodeId: null,
  viewport: { pan: { x: 0, y: 0 }, zoom: 1 },
};

const PALETTE_ITEMS = [
  { description: 'Produces a string request.', id: 'request', title: 'Request' },
  { description: 'Reviews a request and waits for approval.', id: 'review', title: 'Review' },
] as const;

/*** Host one complete, caller-controlled Flow Editor with public ZORA components. */
function FlowCanvasChromiumAcceptance() {
  const [events, setEvents] = useState<readonly string[]>([]);
  const [history, setHistory] = useState<EditorHistory>({
    current: INITIAL_EDITOR,
    future: [],
    past: [],
  });
  const editor = history.current;
  const record = (event: string) => setEvents((current) => [...current, event]);
  const commit = (next: (current: EditorState) => EditorState, event: string) => {
    setHistory((currentHistory) => {
      const updated = next(currentHistory.current);
      if (updated === currentHistory.current) return currentHistory;
      record(event);
      return {
        current: updated,
        future: [],
        past: [...currentHistory.past, currentHistory.current],
      };
    });
  };
  const selectedNode = useMemo(
    () => editor.nodes.find((node) => node.id === editor.selectedNodeId) ?? null,
    [editor.nodes, editor.selectedNodeId],
  );
  const inspectorNode = useMemo(
    () => (selectedNode ? toContractNode(selectedNode, editor.configs) : null),
    [editor.configs, selectedNode],
  );
  const executionSteps = useMemo(
    () =>
      editor.nodes.map((node) => ({
        attempt: 1,
        id: `step-${node.id}`,
        nodeId: node.id,
        status: node.id === 'review-1' ? ('waiting_for_approval' as const) : ('succeeded' as const),
      })),
    [editor.nodes],
  );
  const approval = editor.nodes.some((node) => node.id === 'review-1') ? 'pending' : 'not_required';

  useEffect(() => {
    window.flowAcceptance = {
      read: () => ({
        approval,
        connections: editor.connections.length,
        events,
        nodeMoveChanges: events.filter((event) => event === 'move').length,
        nodes: editor.nodes.map((node) => ({
          id: node.id,
          x: node.position.x,
          y: node.position.y,
        })),
        rejection: editor.rejection,
        selected: editor.selectedNodeId ? [editor.selectedNodeId] : [],
        undoDepth: history.past.length,
        viewport: editor.viewport,
      }),
    };
    return () => {
      delete window.flowAcceptance;
    };
  }, [approval, editor, events, history.past.length]);

  return (
    <main
      data-testid="flow-editor"
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        margin: '0 auto',
        maxWidth: 1280,
        padding: 16,
      }}
    >
      <aside aria-label="Node palette">
        <FlowNodePalette
          items={PALETTE_ITEMS}
          testID="flow-editor-palette"
          onInsert={(itemId) =>
            commit((current) => insertNode(current, itemId), `insert:${itemId}`)
          }
          onSelectionChange={() => undefined}
        />
      </aside>
      <section aria-label="Flow canvas" style={{ minHeight: 560 }}>
        <FlowCanvas
          canRedo={history.future.length > 0}
          canUndo={history.past.length > 0}
          connections={editor.connections}
          nodes={editor.nodes}
          selectedNodeIds={editor.selectedNodeId ? [editor.selectedNodeId] : []}
          testID="flow-canvas"
          viewport={editor.viewport}
          onConnect={(source, target) =>
            commit(
              (current) => ({
                ...current,
                connections: [
                  ...current.connections,
                  { id: `${source.nodeId}-${target.nodeId}`, source, target },
                ],
                rejection: null,
              }),
              'connect',
            )
          }
          onConnectionRejected={(_source, _target, rejection) =>
            commit((current) => ({ ...current, rejection }), `reject:${rejection}`)
          }
          onDisconnect={(connectionId) =>
            commit(
              (current) => ({
                ...current,
                connections: current.connections.filter(
                  (connection) => connection.id !== connectionId,
                ),
              }),
              'disconnect',
            )
          }
          onNodesDelete={(nodeIds) =>
            commit(
              (current) => ({
                ...current,
                connections: current.connections.filter(
                  (connection) =>
                    !nodeIds.includes(connection.source.nodeId) &&
                    !nodeIds.includes(connection.target.nodeId),
                ),
                nodes: current.nodes.filter((node) => !nodeIds.includes(node.id)),
                selectedNodeId: null,
              }),
              'delete',
            )
          }
          onNodesMove={(nodes) => commit((current) => ({ ...current, nodes }), 'move')}
          onNodeSelectionChange={(nodeIds) =>
            commit(
              (current) => ({ ...current, selectedNodeId: nodeIds[0] ?? null }),
              `select:${nodeIds[0] ?? ''}`,
            )
          }
          onRedo={() =>
            setHistory((current) => {
              const next = current.future.at(-1);
              if (!next) return current;
              record('redo');
              return {
                current: next,
                future: current.future.slice(0, -1),
                past: [...current.past, current.current],
              };
            })
          }
          onUndo={() =>
            setHistory((current) => {
              const previous = current.past.at(-1);
              if (!previous) return current;
              record('undo');
              return {
                current: previous,
                future: [...current.future, current.current],
                past: current.past.slice(0, -1),
              };
            })
          }
          onViewportChange={(viewport) =>
            commit((current) => ({ ...current, viewport }), 'viewport')
          }
        />
      </section>
      <aside aria-label="Inspector and execution">
        <div data-testid="flow-validation" role="status">
          {graphValidation(editor)}
        </div>
        <div data-testid="flow-approval-state" role="status">
          Approval: {approval}
        </div>
        <FlowInspector
          fields={[
            { id: 'subject', kind: 'text', label: 'Subject' },
            { id: 'needsApproval', kind: 'boolean', label: 'Needs approval' },
          ]}
          node={inspectorNode}
          selectedNodeId={editor.selectedNodeId ?? undefined}
          testID="flow-editor-inspector"
          values={editor.selectedNodeId ? editor.configs[editor.selectedNodeId] : undefined}
          onNodeSelectionChange={(nodeId) =>
            commit((current) => ({ ...current, selectedNodeId: nodeId }), `select:${nodeId ?? ''}`)
          }
          onValueChange={(fieldId, value) =>
            commit(
              (current) => ({
                ...current,
                configs: current.selectedNodeId
                  ? {
                      ...current.configs,
                      [current.selectedNodeId]: {
                        ...current.configs[current.selectedNodeId],
                        [fieldId]: value,
                      },
                    }
                  : current.configs,
              }),
              `configure:${fieldId}`,
            )
          }
        />
        <FlowExecutionOverlay
          progress={{
            label: 'Graph execution projection',
            max: Math.max(1, executionSteps.length),
            value: executionSteps.length,
          }}
          status={approval === 'pending' ? 'waiting_for_approval' : 'pending'}
          steps={executionSteps}
          testID="flow-editor-execution"
          onStepPress={(step) =>
            commit(
              (current) => ({ ...current, selectedNodeId: step.nodeId }),
              `step:${step.nodeId}`,
            )
          }
        />
      </aside>
    </main>
  );
}

/** Creates only the two palette-owned node DTOs used by this complete example. */
function insertNode(current: EditorState, itemId: string): EditorState {
  if (itemId === 'request' && !current.nodes.some((node) => node.id === 'request-1')) {
    return { ...current, nodes: [...current.nodes, requestNode] };
  }
  if (itemId === 'review' && !current.nodes.some((node) => node.id === 'review-1')) {
    return { ...current, nodes: [...current.nodes, reviewNode] };
  }
  return current;
}

/** Projects the canvas node and host-owned config into the published Contracts node DTO. */
function toContractNode(node: FlowNodeData, configs: EditorState['configs']): FlowNode {
  return {
    capability: {
      capabilityId: node.id.startsWith('request') ? 'compose_request' : 'review_request',
      providerId: 'example',
    },
    config: configs[node.id],
    id: node.id,
    label: node.title,
    ports: node.ports.map(({ data, direction, id, label }) => ({ data, direction, id, label })),
  };
}

/** Produces visible host validation without taking ownership of Flow execution. */
function graphValidation(editor: EditorState): string {
  if (editor.rejection) return `Connection rejected: ${editor.rejection}`;
  if (editor.nodes.length < 2) return 'Graph validation: insert Request and Review nodes.';
  if (editor.connections.length === 0)
    return 'Graph validation: connect Request output to Review input.';
  return 'Graph validation: compatible graph.';
}

const requestNode: FlowNodeData = {
  id: 'request-1',
  ports: [
    {
      data: { schema: { type: 'string' } },
      direction: 'output',
      id: 'request',
      label: 'Request text',
    },
  ],
  position: { x: 40, y: 120 },
  title: 'Request',
};

const reviewNode: FlowNodeData = {
  id: 'review-1',
  ports: [
    {
      data: { schema: { type: 'string' } },
      direction: 'input',
      id: 'request',
      label: 'Request text',
    },
    {
      data: { schema: { type: 'number' } },
      direction: 'input',
      id: 'score',
      label: 'Numeric score',
    },
    {
      data: { schema: { type: 'string' } },
      direction: 'output',
      id: 'approval',
      label: 'Approval',
    },
  ],
  position: { x: 250, y: 180 },
  title: 'Review',
};

document.body.style.margin = '0';
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(
  <ZoraProvider>
    <FlowCanvasChromiumAcceptance />
  </ZoraProvider>,
);
