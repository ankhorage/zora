import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { FlowNodeData } from '../../../../types/flow';
import type { ZoraProvider as ZoraProviderComponent } from '../../../theme/runtime';
import type { FlowNode as FlowNodeComponent } from './FlowNode';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

describe('FlowNode presentation', () => {
  test('renders a completed node with its explicit accessible status, title, description, and icon', async () => {
    const browserWindow = await renderFlowNode({
      description: 'Starts the approved process.',
      presentation: { nodeKind: 'trigger', status: 'completed' },
    });

    try {
      const node = findNode(browserWindow);
      expect(node.getAttribute('aria-label')).toBe('Start process. Completed');
      expect(node.getAttribute('aria-selected')).toBe('false');
      expect(node.textContent).toContain('Start process');
      expect(node.textContent).toContain('Starts the approved process.');
      expect(
        browserWindow.document.querySelector('[data-testid="flow-node-node-icon"]'),
      ).not.toBeNull();
      expect(
        browserWindow.document.querySelector('[data-testid="flow-node-node-status"]'),
      ).not.toBeNull();
    } finally {
      browserWindow.close();
    }
  });

  test('renders waiting as an explicit review status', async () => {
    const browserWindow = await renderFlowNode({ presentation: { status: 'waiting' } });

    try {
      expect(findNode(browserWindow).getAttribute('aria-label')).toBe(
        'Start process. Waiting for review',
      );
      expect(
        browserWindow.document.querySelector('[data-testid="flow-node-node-status"]'),
      ).not.toBeNull();
    } finally {
      browserWindow.close();
    }
  });

  test('keeps a status-less node title-only and does not render an icon or badge', async () => {
    const browserWindow = await renderFlowNode({});

    try {
      expect(findNode(browserWindow).getAttribute('aria-label')).toBe('Start process');
      expect(
        browserWindow.document.querySelector('[data-testid="flow-node-node-icon"]'),
      ).toBeNull();
      expect(
        browserWindow.document.querySelector('[data-testid="flow-node-node-status"]'),
      ).toBeNull();
    } finally {
      browserWindow.close();
    }
  });

  test('shares the trigger artwork for schedule while preserving selection and disabled semantics', async () => {
    const [trigger, schedule] = await Promise.all([
      renderFlowNode({ presentation: { nodeKind: 'trigger' }, selected: true }),
      renderFlowNode({ disabled: true, presentation: { nodeKind: 'schedule' } }),
    ]);

    try {
      expect(findNode(trigger).getAttribute('aria-selected')).toBe('true');
      expect(findNode(schedule).getAttribute('aria-disabled')).toBe('true');
      expect(iconAssetSource(trigger)).toBe(iconAssetSource(schedule));
    } finally {
      trigger.close();
      schedule.close();
    }
  });

  test('retains read-only behavior without duplicating the node announcement', async () => {
    const browserWindow = await renderFlowNode({ readOnly: true });

    try {
      const nodes = browserWindow.document.querySelectorAll('[aria-label="Start process"]');
      expect(nodes).toHaveLength(1);
      expect(findNode(browserWindow).getAttribute('aria-disabled')).toBe('true');
    } finally {
      browserWindow.close();
    }
  });
});

/*** Render the public web FlowNode implementation through its production theme boundary. */
async function renderFlowNode(overrides: FlowNodeOverrides): Promise<Window> {
  const { FlowNode, ZoraProvider } = await loadWebFlowNode();
  const browserWindow = new Window();
  const node: FlowNodeData = {
    id: 'node',
    ports: [],
    position: { x: 0, y: 0 },
    title: 'Start process',
    ...overrides,
  };
  browserWindow.document.body.innerHTML = renderToStaticMarkup(
    <ZoraProvider mode="light">
      <FlowNode
        canvasRef={React.createRef()}
        node={node}
        readOnly={overrides.readOnly ?? false}
        selected={overrides.selected ?? false}
        zoomRef={React.createRef<number>()}
        onMove={() => undefined}
        onNodePress={() => undefined}
        onPortLayout={() => undefined}
        onPortPress={() => undefined}
      />
    </ZoraProvider>,
  );
  return browserWindow;
}

/*** Load the actual generated React Native Web FlowNode boundary. */
async function loadWebFlowNode() {
  const [{ FlowNode }, { ZoraProvider }] = await Promise.all([
    import(pathToFileURL(join(webDistRoot, 'components/flow-node/FlowNode.js')).href) as Promise<{
      FlowNode: typeof FlowNodeComponent;
    }>,
    import(pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href) as Promise<{
      ZoraProvider: typeof ZoraProviderComponent;
    }>,
  ]);
  return { FlowNode, ZoraProvider };
}

/*** Retrieve FlowNode's one actionable accessibility boundary. */
function findNode(browserWindow: Window): Element {
  const node = browserWindow.document.querySelector('[data-testid="flow-node-node"]');
  if (!node) throw new Error('Expected the FlowNode action.');
  return node;
}

/*** Read the image URL rendered by the published Surface Icon adapter. */
function iconAssetSource(browserWindow: Window): string | null {
  return (
    browserWindow.document
      .querySelector('[data-testid="flow-node-node-icon"] [style*="background-image"]')
      ?.getAttribute('style')
      ?.match(/background-image:url\(&quot;([^&]+)&quot;\)/u)?.[1] ?? null
  );
}

type FlowNodeOverrides = Partial<FlowNodeData> & {
  readonly readOnly?: boolean;
  readonly selected?: boolean;
};
