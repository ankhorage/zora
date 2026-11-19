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

const FLOW_EDITOR_THEME = {
  appCategory: 'developer_tools',
  harmony: 'analogous',
  id: 'flow-editor',
  name: 'Flow Editor',
  primaryColor: '#6f3eb4',
} as const;

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
    <main className="flow-editor" data-testid="flow-editor">
      <header className="flow-editor__header">
        <div>
          <p className="flow-editor__eyebrow">PROCESS ENGINE</p>
          <h1>Customer request review</h1>
          <p>Compose, connect, and configure the workflow.</p>
        </div>
        <div className="flow-editor__status" role="status">
          {graphValidation(editor)}
        </div>
      </header>
      <aside aria-label="Node palette" className="flow-editor__palette">
        <div className="flow-editor__panel-heading">
          <h2>Nodes</h2>
          <p>Choose a step to add it to the process.</p>
        </div>
        <FlowNodePalette
          items={PALETTE_ITEMS}
          testID="flow-editor-palette"
          onInsert={(itemId) =>
            commit((current) => insertNode(current, itemId), `insert:${itemId}`)
          }
          onSelectionChange={() => undefined}
        />
      </aside>
      <section aria-label="Flow canvas" className="flow-editor__canvas">
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
      <aside aria-label="Inspector and execution" className="flow-editor__inspector">
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
          outline={editor.nodes.map((node) => ({
            id: node.id,
            status: node.id === 'review-1' ? 'waiting_for_approval' : 'succeeded',
            title: node.title,
          }))}
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
  position: { x: 430, y: 300 },
  title: 'Review',
};

document.head.insertAdjacentHTML(
  'beforeend',
  `<style>
    * { box-sizing: border-box; }
    body {
      background: #f4f1fb;
      color: #2f1d43;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
    }
    .flow-editor {
      background: #f4f1fb;
      display: grid;
      gap: 16px;
      grid-template-columns: 232px minmax(0, 1fr) 320px;
      grid-template-rows: auto minmax(620px, calc(100vh - 168px));
      margin: 0 auto;
      max-width: 1600px;
      min-height: 100vh;
      padding: 24px;
    }
    .flow-editor__header {
      align-items: center;
      background: #fff;
      border: 1px solid #e5dcf0;
      border-radius: 18px;
      box-shadow: 0 8px 24px rgba(65, 32, 96, .07);
      display: flex;
      grid-column: 1 / -1;
      justify-content: space-between;
      padding: 18px 22px;
    }
    .flow-editor__header h1, .flow-editor__panel-heading h2 { color: #32194f; margin: 0; }
    .flow-editor__header h1 { font-size: 24px; letter-spacing: -.02em; }
    .flow-editor__header p, .flow-editor__panel-heading p { color: #766889; font-size: 14px; margin: 4px 0 0; }
    .flow-editor__eyebrow { color: #6f3eb4 !important; font-size: 11px !important; font-weight: 800; letter-spacing: .11em; margin: 0 0 4px !important; }
    .flow-editor__status, [data-testid="flow-validation"] {
      background: #f0e9fb;
      border: 1px solid #dacbf0;
      border-radius: 999px;
      color: #5f3398;
      font-size: 12px;
      font-weight: 700;
      max-width: 340px;
      padding: 9px 12px;
    }
    .flow-editor__palette, .flow-editor__inspector, .flow-editor__canvas {
      background: #fff;
      border: 1px solid #e5dcf0;
      border-radius: 18px;
      box-shadow: 0 8px 24px rgba(65, 32, 96, .07);
      min-width: 0;
      overflow: auto;
    }
    .flow-editor__palette, .flow-editor__inspector { padding: 16px; }
    .flow-editor__palette { scrollbar-gutter: stable; }
    .flow-editor__panel-heading { border-bottom: 1px solid #eee8f5; margin-bottom: 14px; padding-bottom: 14px; }
    .flow-editor__panel-heading h2 { font-size: 16px; }
    .flow-editor__canvas { display: flex; min-height: 620px; overflow: hidden; }
    .flow-editor__canvas > div { flex: 1; }
    .flow-editor__inspector { display: flex; flex-direction: column; gap: 16px; }
    [data-testid="flow-approval-state"] { color: #766889; font-size: 13px; font-weight: 600; }
    [data-testid="flow-editor-execution"] { border-top: 1px solid #eee8f5; padding-top: 16px; }
    @media (max-width: 900px) {
      .flow-editor { grid-template-columns: 208px minmax(0, 1fr); grid-template-rows: auto minmax(560px, auto) auto; padding: 16px; }
      .flow-editor__header { grid-column: 1 / -1; }
      .flow-editor__inspector { grid-column: 1 / -1; }
    }
    @media (max-width: 600px) {
      .flow-editor { display: flex; flex-direction: column; gap: 12px; min-height: 100vh; padding: 12px; }
      .flow-editor__header { align-items: flex-start; border-radius: 14px; flex-direction: column; gap: 12px; padding: 16px; }
      .flow-editor__header h1 { font-size: 21px; }
      .flow-editor__status { max-width: none; width: 100%; }
      .flow-editor__palette { overflow: visible; }
      .flow-editor__canvas { display: none; }
      .flow-editor__inspector { max-height: none; order: 3; }
      [data-testid="flow-editor-inspector-outline"] {
        background: #fbf9fd;
        border: 1px solid #e5dcf0;
        border-radius: 12px;
        padding: 8px;
      }
      [data-testid="flow-editor-inspector-outline"] [role="button"] {
        align-items: center;
        border-bottom: 1px solid #eee8f5;
        display: flex;
        min-height: 52px;
        padding: 0 8px;
      }
      [data-testid="flow-editor-inspector-outline"] [role="button"]:last-child { border-bottom: 0; }
    }
  </style>`,
);
const host = document.createElement('div');
document.body.append(host);
createRoot(host).render(
  <ZoraProvider theme={FLOW_EDITOR_THEME}>
    <FlowCanvasChromiumAcceptance />
  </ZoraProvider>,
);
