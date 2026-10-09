import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GridView as GridViewComponent } from './GridView';
import type { TileGrid as TileGridComponent } from './TileGrid';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');
const load = () => import(pathToFileURL(join(webDistRoot, 'components/grid-view/index.js')).href);
const items: readonly GridRectItem[] = [
  { height: 20, id: 'near', width: 20, x: 10, y: 10 },
  { height: 20, id: 'far', width: 20, x: 300, y: 300 },
];
const constraints = { world: { height: 1000, width: 1000, x: 0, y: 0 } };

test('supports accessible pan and zoom controls and native scrolling without feedback proposals', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const changes: GridViewport[] = [];
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            height={100}
            items={items}
            onViewportChange={(viewport) => changes.push(viewport)}
            renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
            testID="grid"
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      const panRight = host.querySelector<HTMLButtonElement>('[aria-label="Pan right"]');
      const zoomIn = host.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]');
      if (!horizontal || !panRight || !zoomIn) throw new Error('Missing interactive grid controls');

      expect(host.querySelectorAll('[role="button"]')).toHaveLength(6);
      horizontal.scrollLeft = 25;
      await interactAsync(() =>
        horizontal.dispatchEvent(new browserWindow.Event('scroll', { bubbles: true })),
      );
      expect(changes).toHaveLength(1);
      expect(changes.at(-1)?.offsetX).toBe(25);

      await interactAsync(() => panRight.click());
      await interactAsync(() => zoomIn.click());
      expect(changes).toHaveLength(3);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('keeps focus reveal proposal-only and prevents controlled and uncontrolled callback loops', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (_browserWindow, host) => {
    const controlledChanges: GridViewport[] = [];
    const root = createRoot(host);
    const controlledViewport = createViewport();
    try {
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            focusedItemId="near"
            height={100}
            items={[...items]}
            onViewportChange={(viewport) => controlledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewport={controlledViewport}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            focusedItemId="near"
            height={100}
            items={[...items]}
            onViewportChange={(viewport) => controlledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewport={{ ...controlledViewport }}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      expect(controlledChanges).toEqual([]);

      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            focusedItemId="far"
            height={100}
            items={[...items]}
            onViewportChange={(viewport) => controlledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewport={controlledViewport}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      expect(controlledChanges).toHaveLength(1);
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            focusedItemId="far"
            height={100}
            items={[...items]}
            onViewportChange={(viewport) => controlledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewport={controlledChanges[0]}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      expect(controlledChanges).toHaveLength(1);

      const uncontrolledChanges: GridViewport[] = [];
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            focusedItemId="far"
            height={100}
            items={items}
            onViewportChange={(viewport) => uncontrolledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      expect(uncontrolledChanges).toHaveLength(1);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('maps centered bounds and overscroll to native positions and preserves a local pinch focal world point', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const changes: GridViewport[] = [];
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={50}
            contentWidth={50}
            height={600}
            items={[{ height: 50, id: 'small', width: 50, x: 0, y: 0 }]}
            renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
            testID="grid"
            viewportConstraints={{ world: { height: 50, width: 50, x: 0, y: 0 } }}
            width={800}
          />,
        ),
      );
      expect(host.querySelector('[data-grid-item="small"]')?.parentElement?.style.left).toBe(
        '375px',
      );
      expect(host.querySelector('[data-grid-item="small"]')?.parentElement?.style.top).toBe(
        '275px',
      );

      await interactAsync(() =>
        root.render(
          <GridView
            contentHeight={1000}
            contentWidth={1000}
            height={100}
            items={items}
            onViewportChange={(viewport) => changes.push(viewport)}
            renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
            testID="grid"
            viewport={createViewport({ offsetX: -20, offsetY: -20 })}
            viewportConstraints={{
              overscrollX: 20,
              overscrollY: 20,
              world: { height: 1000, width: 1000, x: 0, y: 0 },
            }}
            width={100}
          />,
        ),
      );
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      if (!horizontal) throw new Error('Missing horizontal scroll view');
      expect(horizontal.firstElementChild?.firstElementChild?.getAttribute('style')).toContain(
        'width: 1040px',
      );

      const grid = host.querySelector<HTMLElement>('[data-testid="grid"]');
      if (!grid) throw new Error('Missing grid viewport');
      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { locationX: 20, locationY: 50, pageX: 220, pageY: 250 },
        { locationX: 80, locationY: 50, pageX: 280, pageY: 250 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchmove', [
        { locationX: -10, locationY: 50, pageX: 190, pageY: 250 },
        { locationX: 110, locationY: 50, pageX: 310, pageY: 250 },
      ]);
      expect(changes.at(-1)?.pixelsPerUnitX).toBe(2);
      expect(changes.at(-1)?.offsetX).toBe(5);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('uses default viewport scale when laying out TileGrid columns', async () => {
  const { TileGrid } = (await load()) as { TileGrid: typeof TileGridComponent };
  await withBrowserAsync(async (_browserWindow, host) => {
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <TileGrid
            defaultViewport={{ pixelsPerUnitX: 2, pixelsPerUnitY: 2 }}
            height={300}
            items={[{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]}
            renderItem={(item) => <span data-tile={item.id}>{item.id}</span>}
            tileSize={100}
            width={500}
          />,
        ),
      );
      expect(host.querySelector('[data-tile="c"]')?.parentElement?.style.top).toBe('224px');
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

/*** Provides a stable controlled viewport for component interaction tests. */
function createViewport(overrides: Partial<GridViewport> = {}): GridViewport {
  return {
    height: 100,
    offsetX: 0,
    offsetY: 0,
    pixelsPerUnitX: 1,
    pixelsPerUnitY: 1,
    width: 100,
    ...overrides,
  };
}

/*** Executes a React interaction after the renderer has a chance to flush effects. */
function interactAsync(action: () => void): Promise<void> {
  return act(() => Promise.resolve().then(action));
}

/*** Mounts an isolated browser surface and restores global DOM bindings after a test. */
async function withBrowserAsync(
  test: (browserWindow: Window, host: HTMLElement) => Promise<void>,
): Promise<void> {
  const browserWindow = new Window();
  const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browserWindow,
    document: browserWindow.document,
    Node: browserWindow.Node,
    navigator: browserWindow.navigator,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  try {
    await test(browserWindow, host);
  } finally {
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

/*** Dispatches a synthetic RN/RNW touch sequence with page and viewport-local coordinates. */
function dispatchTouchesAsync(
  browserWindow: Window,
  target: HTMLElement,
  type: 'touchstart' | 'touchmove',
  touches: readonly Readonly<{
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
  }>[],
): Promise<void> {
  const event = new browserWindow.Event(type, { bubbles: true });
  Object.defineProperty(event, 'touches', { value: touches });
  return interactAsync(() => target.dispatchEvent(event));
}
