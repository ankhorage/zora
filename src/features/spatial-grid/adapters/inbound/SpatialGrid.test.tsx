import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import type { SpatialGrid as SpatialGridComponent } from './SpatialGrid';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

/** Loads the independently bundled React Native Web component through its public artifact path. */
function loadSpatialGrid() {
  return import(
    pathToFileURL(join(webDistRoot, 'components/spatial-grid/index.js')).href
  ) as Promise<{
    SpatialGrid: typeof SpatialGridComponent;
  }>;
}

test('renders a bounded, accessible 10k free-placement catalog in deterministic overlap order', async () => {
  const items = [
    { height: 30, id: 'back', width: 30, x: 0, y: 0, zIndex: -1 },
    { height: 30, id: 'front', width: 30, x: 0, y: 0, zIndex: 1 },
    ...Array.from({ length: 9998 }, (_, index) => ({
      height: 20,
      id: `item-${index}`,
      width: 20,
      x: 1000 + (index % 100) * 100,
      y: 1000 + Math.floor(index / 100) * 100,
    })),
  ];
  await withBrowserRoot(async (browserWindow) => {
    const { SpatialGrid } = await loadSpatialGrid();
    browserWindow.document.body.innerHTML = renderToStaticMarkup(
      <SpatialGrid
        contentHeight={11000}
        contentWidth={11000}
        height={100}
        items={items}
        selectedItemId="front"
        testID="board"
        width={100}
        zoom={2}
        renderItem={(item) => <span>{item.id}</span>}
      />,
    );
    const mounted = [...browserWindow.document.querySelectorAll('[data-testid^="board-item-"]')];

    expect(mounted).toHaveLength(2);
    expect(mounted.map((element) => element.getAttribute('data-testid'))).toEqual([
      'board-item-back',
      'board-item-front',
    ]);
    expect(
      browserWindow.document
        .querySelector('[data-testid="board-item-front"]')
        ?.getAttribute('role'),
    ).toBe('button');
    expect(
      browserWindow.document
        .querySelector('[data-testid="board-item-front"]')
        ?.getAttribute('tabindex'),
    ).toBe('0');
    expect(
      browserWindow.document
        .querySelector('[data-testid="board-item-front"]')
        ?.getAttribute('aria-label'),
    ).toBe('Spatial grid item front');
  });
});

test('activates the topmost overlapping item by pointer and keyboard', async () => {
  const { SpatialGrid } = await loadSpatialGrid();
  const selection: string[] = [];
  const activation: string[] = [];
  await withBrowserRoot(async (browserWindow, host, root) => {
    await renderSpatialGrid(
      root,
      <SpatialGrid
        contentHeight={100}
        contentWidth={100}
        height={100}
        items={[
          { height: 50, id: 'back', width: 50, x: 10, y: 20, zIndex: -1 },
          { height: 50, id: 'front', width: 50, x: 10, y: 20, zIndex: 1 },
        ]}
        testID="interactive-board"
        width={100}
        onActivation={(id) => activation.push(id)}
        onSelectionChange={(id) => selection.push(id)}
        renderItem={(item) => <span>{item.id}</span>}
      />,
    );
    const front = requireItem(host, 'interactive-board-item-front');
    await dispatch(front, new browserWindow.MouseEvent('click', { bubbles: true }));
    await dispatch(
      front,
      new browserWindow.KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
    );
    await dispatch(
      front,
      new browserWindow.KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }),
    );
    // happy-dom does not synthesize the browser click dispatched for an activated button.
    await dispatch(front, new browserWindow.MouseEvent('click', { bubbles: true }));
    expect(selection).toEqual(['front', 'front']);
    expect(activation).toEqual(['front', 'front']);
  });
});

test('separates disabled, read-only, and passive interaction behavior', async () => {
  const { SpatialGrid } = await loadSpatialGrid();
  const selection: string[] = [];
  const activation: string[] = [];
  const focus: string[] = [];
  await withBrowserRoot(async (browserWindow, host, root) => {
    const render = (
      props: Pick<
        React.ComponentProps<typeof SpatialGrid>,
        'disabled' | 'readOnly' | 'interactionPolicy'
      >,
    ) => (
      <SpatialGrid
        contentHeight={100}
        contentWidth={100}
        height={100}
        items={[{ height: 50, id: 'node', width: 50, x: 10, y: 20 }]}
        testID="interactive-board"
        width={100}
        onActivation={(id) => activation.push(id)}
        onFocusChange={(id) => focus.push(id)}
        onSelectionChange={(id) => selection.push(id)}
        renderItem={(item) => <span>{item.id}</span>}
        {...props}
      />
    );
    for (const props of [
      { disabled: true },
      { readOnly: true },
      { interactionPolicy: 'passive' as const },
    ]) {
      await renderSpatialGrid(root, render(props));
      const item = requireItem(host, 'interactive-board-item-node');
      await dispatch(item, new browserWindow.FocusEvent('focusin', { bubbles: true }));
      await dispatch(item, new browserWindow.MouseEvent('click', { bubbles: true }));
    }

    expect(selection).toEqual([]);
    expect(activation).toEqual([]);
    expect(focus).toEqual(['node']);
  });
});

test('reveals a focused offscreen item through the composed GridView viewport', async () => {
  const { SpatialGrid } = await loadSpatialGrid();
  await withBrowserRoot(async (_browserWindow, host, root) => {
    const scrollCalls: unknown[] = [];
    const render = (focusedItemId?: string) => (
      <SpatialGrid
        contentHeight={1000}
        contentWidth={1000}
        focusedItemId={focusedItemId}
        height={100}
        items={[{ height: 20, id: 'distant', width: 20, x: 400, y: 500 }]}
        revealPaddingPixels={10}
        width={100}
        renderItem={(item) => <span>{item.id}</span>}
      />
    );
    await renderSpatialGrid(root, render());
    const scrollableNodes = [...host.querySelectorAll('div')] as HTMLElement[];
    for (const node of scrollableNodes) {
      node.scrollTo = (options: unknown) => scrollCalls.push(options);
    }
    await renderSpatialGrid(root, render('distant'));

    expect(scrollCalls).toContainEqual({ animated: true, x: 330 });
    expect(scrollCalls).toContainEqual({ animated: true, y: 430 });
  });
});

/** Runs a mounted RNW test with its DOM globals restored after the assertion. */
async function withBrowserRoot(
  callback: (
    browserWindow: Window,
    host: HTMLDivElement,
    root: ReturnType<typeof createRoot>,
  ) => Promise<void>,
) {
  const browserWindow = new Window();
  const keys = [
    'window',
    'document',
    'Node',
    'navigator',
    'ShadowRoot',
    'IS_REACT_ACT_ENVIRONMENT',
  ] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browserWindow,
    document: browserWindow.document,
    Node: browserWindow.Node,
    navigator: browserWindow.navigator,
    ShadowRoot: browserWindow.ShadowRoot,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    await callback(browserWindow, host, root);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

/** Renders a component through React's mounted interaction boundary. */
function renderSpatialGrid(root: ReturnType<typeof createRoot>, component: React.ReactNode) {
  return act(() => Promise.resolve().then(() => root.render(component)));
}

/** Retrieves one mounted item by its stable test identifier. */
function requireItem(host: HTMLDivElement, testID: string): HTMLElement {
  const item = host.querySelector(`[data-testid="${testID}"]`);
  if (!item) throw new Error(`SpatialGrid did not render ${testID}.`);
  return item as HTMLElement;
}

/** Dispatches one mounted native-web event through React's synthetic event boundary. */
function dispatch(target: EventTarget, event: Event) {
  return act(() =>
    Promise.resolve().then(() => {
      target.dispatchEvent(event);
    }),
  );
}
