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
  { height: 20, id: 'far-other', width: 20, x: 600, y: 600 },
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

test('deduplicates a controlled focus-reveal veto while allowing accepted movement and focus changes', async () => {
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
            viewport={{ ...controlledViewport }}
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
            focusedItemId="far-other"
            height={100}
            items={[...items]}
            onViewportChange={(viewport) => controlledChanges.push(viewport)}
            renderItem={(item) => <span>{item.id}</span>}
            viewport={controlledChanges.at(-1)}
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      expect(controlledChanges).toHaveLength(2);

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
      Object.defineProperty(grid, 'getBoundingClientRect', {
        value: () => ({ left: 200, top: 200 }),
      });
      Object.defineProperty(grid, 'measureInWindow', {
        value: (callback: (x: number, y: number) => void) => callback(200, 200),
      });
      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { locationX: 8, locationY: 12, pageX: 220, pageY: 250 },
        { locationX: 72, locationY: 88, pageX: 280, pageY: 250 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchmove', [
        { locationX: 1, locationY: 99, pageX: 190, pageY: 250 },
        { locationX: 99, locationY: 1, pageX: 310, pageY: 250 },
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

test('keeps TileGrid placement synchronized with uncontrolled and controlled GridView zoom', async () => {
  const { TileGrid } = (await load()) as { TileGrid: typeof TileGridComponent };
  const tileItems = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
  await withBrowserAsync(async (_browserWindow, host) => {
    const uncontrolledColumns: number[] = [];
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <TileGrid
            height={300}
            items={tileItems}
            onColumnsChange={(columns) => uncontrolledColumns.push(columns)}
            renderItem={(item) => <span data-tile={item.id}>{item.id}</span>}
            tileSize={100}
            width={500}
          />,
        ),
      );
      const zoomIn = host.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]');
      if (!zoomIn) throw new Error('Missing uncontrolled TileGrid zoom control');
      await interactAsync(() => zoomIn.click());
      expect(uncontrolledColumns).toEqual([4, 3]);
      expect(host.querySelector('[data-tile="d"]')?.parentElement?.style.top).not.toBe(
        host.querySelector('[data-tile="a"]')?.parentElement?.style.top,
      );

      const controlledChanges: GridViewport[] = [];
      const controlledViewport = createViewport({ height: 300, width: 500 });
      await interactAsync(() =>
        root.render(
          <TileGrid
            height={300}
            items={tileItems}
            onViewportChange={(nextViewport) => controlledChanges.push(nextViewport)}
            renderItem={(item) => <span data-tile={item.id}>{item.id}</span>}
            tileSize={100}
            viewport={controlledViewport}
            width={500}
          />,
        ),
      );
      const controlledZoomIn = host.querySelector<HTMLButtonElement>('[aria-label="Zoom in"]');
      if (!controlledZoomIn) throw new Error('Missing controlled TileGrid zoom control');
      await interactAsync(() => controlledZoomIn.click());
      expect(controlledChanges).toHaveLength(1);
      await interactAsync(() =>
        root.render(
          <TileGrid
            height={300}
            items={tileItems}
            onViewportChange={(nextViewport) => controlledChanges.push(nextViewport)}
            renderItem={(item) => <span data-tile={item.id}>{item.id}</span>}
            tileSize={100}
            viewport={controlledChanges[0]}
            width={500}
          />,
        ),
      );
      expect(host.querySelector('[data-tile="d"]')?.parentElement?.style.top).not.toBe(
        host.querySelector('[data-tile="a"]')?.parentElement?.style.top,
      );
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('waits for the newest asynchronous viewport measurement before continuous pinch zoom', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const changes: GridViewport[] = [];
    const measurements: ((x: number, y: number) => void)[] = [];
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
            renderItem={(item) => <span>{item.id}</span>}
            testID="grid"
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      const grid = host.querySelector<HTMLElement>('[data-testid="grid"]');
      if (!grid) throw new Error('Missing grid viewport');
      Object.defineProperty(grid, 'measureInWindow', {
        value: (callback: (x: number, y: number) => void) => measurements.push(callback),
      });
      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { pageX: 210, pageY: 170 },
        { pageX: 290, pageY: 170 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchmove', [
        { pageX: 200, pageY: 170 },
        { pageX: 300, pageY: 170 },
      ]);
      await interactAsync(() => measurements[0]?.(20, 20));
      await interactAsync(() => measurements[1]?.(200, 150));
      await dispatchTouchesAsync(browserWindow, grid, 'touchmove', [
        { pageX: 190, pageY: 170 },
        { pageX: 310, pageY: 170 },
      ]);
      await interactAsync(() => measurements[2]?.(200, 150));
      expect(changes).toHaveLength(1);
      expect(changes[0]?.pixelsPerUnitX).toBe(1.2);
      expect(changes[0]?.offsetX).toBeCloseTo(8.333333333333343);
      expect(changes[0]?.offsetY).toBeCloseTo(3.333333333333332);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('invalidates delayed pinch measurements after touch lifecycle completion', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const changes: GridViewport[] = [];
    const measurements: ((x: number, y: number) => void)[] = [];
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
            renderItem={(item) => <span>{item.id}</span>}
            testID="grid"
            viewportConstraints={constraints}
            width={100}
          />,
        ),
      );
      const grid = host.querySelector<HTMLElement>('[data-testid="grid"]');
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      const vertical = host.querySelector<HTMLElement>('[data-testid="grid-vertical-scroll"]');
      if (!grid || !horizontal || !vertical) throw new Error('Missing grid scroll surfaces');
      Object.defineProperty(grid, 'measureInWindow', {
        value: (callback: (x: number, y: number) => void) => measurements.push(callback),
      });

      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { pageX: 10, pageY: 50 },
        { pageX: 90, pageY: 50 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchend', []);
      await interactAsync(() => measurements[0]?.(200, 150));
      expect(changes).toHaveLength(0);
      expect(horizontal.style.overflowX).not.toBe('hidden');
      expect(vertical.style.overflowY).not.toBe('hidden');

      horizontal.scrollLeft = 20;
      await interactAsync(() =>
        horizontal.dispatchEvent(new browserWindow.Event('scroll', { bubbles: true })),
      );
      expect(changes).toHaveLength(1);

      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { pageX: 10, pageY: 50 },
        { pageX: 90, pageY: 50 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchcancel', []);
      await interactAsync(() => measurements[1]?.(200, 150));
      expect(changes).toHaveLength(1);
      expect(horizontal.style.overflowX).not.toBe('hidden');
      expect(vertical.style.overflowY).not.toBe('hidden');

      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { pageX: 10, pageY: 50 },
        { pageX: 90, pageY: 50 },
      ]);
      await dispatchTouchesAsync(browserWindow, grid, 'touchend', []);
      await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
        { pageX: 10, pageY: 50 },
        { pageX: 90, pageY: 50 },
      ]);
      await interactAsync(() => measurements[2]?.(200, 150));
      await dispatchTouchesAsync(browserWindow, grid, 'touchend', []);
      await interactAsync(() => measurements[3]?.(200, 150));
      expect(changes).toHaveLength(1);
      expect(horizontal.style.overflowX).not.toBe('hidden');
      expect(vertical.style.overflowY).not.toBe('hidden');
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('invalidates a pending pinch update when GridView unmounts', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const changes: GridViewport[] = [];
    const measurements: ((x: number, y: number) => void)[] = [];
    const root = createRoot(host);
    await interactAsync(() =>
      root.render(
        <GridView
          contentHeight={1000}
          contentWidth={1000}
          height={100}
          items={items}
          onViewportChange={(viewport) => changes.push(viewport)}
          renderItem={(item) => <span>{item.id}</span>}
          testID="grid"
          viewportConstraints={constraints}
          width={100}
        />,
      ),
    );
    const grid = host.querySelector<HTMLElement>('[data-testid="grid"]');
    if (!grid) throw new Error('Missing grid viewport');
    Object.defineProperty(grid, 'measureInWindow', {
      value: (callback: (x: number, y: number) => void) => measurements.push(callback),
    });

    await dispatchTouchesAsync(browserWindow, grid, 'touchstart', [
      { pageX: 10, pageY: 50 },
      { pageX: 90, pageY: 50 },
    ]);
    await interactAsync(() => measurements[0]?.(0, 0));
    await dispatchTouchesAsync(browserWindow, grid, 'touchmove', [
      { pageX: 0, pageY: 50 },
      { pageX: 100, pageY: 50 },
    ]);
    await interactAsync(() => root.unmount());
    await interactAsync(() => measurements[1]?.(0, 0));
    expect(changes).toHaveLength(0);
  });
});

test('ignores native echoes of an animated focus reveal and still follows real user scrolling', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const root = createRoot(host);
    const harness = createRevealHarness(GridView, host, browserWindow);
    try {
      await harness.renderAsync(root, undefined);
      await harness.renderAsync(root, 'far');
      const target = harness.lastRequestedTop();
      expect(harness.changes).toHaveLength(1);
      expect(target).toBeGreaterThan(100);

      await harness.scrollToAsync(target / 4);
      await harness.scrollToAsync(target / 2);
      await harness.scrollToAsync(target + 0.4);
      expect(harness.changes).toHaveLength(1);

      await harness.scrollToAsync(target + 30);
      expect(harness.changes).toHaveLength(2);
      expect(harness.changes.at(-1)?.offsetY).toBeCloseTo(target + 30, 5);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('adopts the native offset when an animated reveal is interrupted before reaching its target', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const root = createRoot(host);
    const harness = createRevealHarness(GridView, host, browserWindow);
    try {
      await harness.renderAsync(root, undefined);
      await harness.renderAsync(root, 'far');
      await harness.scrollToAsync(40);
      expect(harness.changes).toHaveLength(1);

      await waitUntilAsync(() => harness.changes.length === 2);
      expect(harness.changes).toHaveLength(2);
      expect(harness.changes.at(-1)?.offsetY).toBe(40);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('retargets an in-flight reveal without feeding stale animation frames back as pans', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const root = createRoot(host);
    const harness = createRevealHarness(GridView, host, browserWindow);
    try {
      await harness.renderAsync(root, undefined);
      await harness.renderAsync(root, 'far');
      const firstTarget = harness.lastRequestedTop();
      await harness.scrollToAsync(firstTarget / 2);
      await harness.renderAsync(root, 'far-other');
      const secondTarget = harness.lastRequestedTop();
      expect(secondTarget).toBeGreaterThan(firstTarget);

      await harness.scrollToAsync(firstTarget / 2 + 10);
      await harness.scrollToAsync(firstTarget);
      await harness.scrollToAsync(secondTarget);

      expect(harness.changes).toHaveLength(2);
      expect(harness.changes.at(-1)?.offsetY).toBe(secondTarget);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('settles an interrupted vertical reveal while the horizontal reveal echo stays pending', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  const wideItems: readonly GridRectItem[] = [
    { height: 20, id: 'wide', width: 20, x: 500, y: 300 },
  ];
  await withBrowserAsync(async (browserWindow, host) => {
    const root = createRoot(host);
    const harness = createRevealHarness(GridView, host, browserWindow, wideItems);
    try {
      await harness.renderAsync(root, undefined);
      await harness.renderAsync(root, 'wide');

      // Both axes receive their own programmatic target before any echo is simulated.
      expect(harness.lastRequestedLeft()).toBe(428);
      expect(harness.lastRequestedTop()).toBe(228);
      expect(harness.changes).toHaveLength(1);
      expect(harness.changes[0]).toMatchObject({ offsetX: 428, offsetY: 228 });

      // The vertical animation is interrupted at its real native offset and then goes quiet.
      await harness.scrollToAsync(40);
      expect(harness.changes).toHaveLength(1);
      await waitUntilAsync(() => harness.changes.length === 2);
      expect(harness.changes[1]).toMatchObject({ offsetX: 428, offsetY: 40 });

      // Horizontal animation frames and their settled echo are still not user pans.
      await harness.scrollLeftToAsync(200);
      await harness.scrollLeftToAsync(428.4);
      expect(harness.changes).toHaveLength(2);

      // A genuine horizontal drag afterwards is adopted from the pre-echo baseline.
      await harness.scrollLeftToAsync(458);
      expect(harness.changes).toHaveLength(3);
      expect(harness.changes[2]).toMatchObject({ offsetX: 458, offsetY: 40 });
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('keeps the scroll arbiter working after React Strict Mode double-invokes its mount effects', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (browserWindow, host) => {
    const root = createRoot(host);
    const harness = createRevealHarness(GridView, host, browserWindow, items, true);
    try {
      await harness.renderAsync(root, undefined);
      await harness.renderAsync(root, 'far');
      const target = harness.lastRequestedTop();
      expect(target).toBe(228);
      expect(harness.changes).toHaveLength(1);

      await harness.scrollToAsync(target / 4);
      await harness.scrollToAsync(target / 2);
      await harness.scrollToAsync(target + 0.4);
      expect(harness.changes).toHaveLength(1);

      await harness.scrollToAsync(target + 30);
      expect(harness.changes).toHaveLength(2);
      expect(harness.changes[1]?.offsetY).toBeCloseTo(target + 30, 5);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

test('scrolls the native views to a non-zero default viewport on a Strict Mode mount', async () => {
  const { GridView } = (await load()) as { GridView: typeof GridViewComponent };
  await withBrowserAsync(async (_browserWindow, host) => {
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <React.StrictMode>
            <GridView
              contentHeight={1000}
              contentWidth={1000}
              defaultViewport={{ offsetX: 70, offsetY: 50 }}
              height={100}
              items={items}
              renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
              testID="grid"
              viewportConstraints={constraints}
              width={100}
            />
          </React.StrictMode>,
        ),
      );
      const vertical = host.querySelector<HTMLElement>('[data-testid="grid-vertical-scroll"]');
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      expect(vertical?.scrollTop).toBe(50);
      expect(horizontal?.scrollLeft).toBe(70);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

/*** Records vertical native scroll requests and drives scroll events for focus-reveal tests. */
function createRevealHarness(
  GridView: typeof GridViewComponent,
  host: HTMLElement,
  browserWindow: Window,
  gridItems: readonly GridRectItem[] = items,
  strict = false,
) {
  const changes: GridViewport[] = [];
  const requestedTops: number[] = [];
  const requestedLefts: number[] = [];
  const Wrapper = strict ? React.StrictMode : React.Fragment;
  return {
    changes,
    lastRequestedLeft: () => requestedLefts.at(-1) ?? Number.NaN,
    lastRequestedTop: () => requestedTops.at(-1) ?? Number.NaN,
    renderAsync: async (root: ReturnType<typeof createRoot>, focusedItemId: string | undefined) => {
      await interactAsync(() =>
        root.render(
          <Wrapper>
            <GridView
              contentHeight={1000}
              contentWidth={1000}
              focusedItemId={focusedItemId}
              height={100}
              items={gridItems}
              onViewportChange={(viewport) => changes.push(viewport)}
              renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
              testID="grid"
              viewportConstraints={constraints}
              width={100}
            />
          </Wrapper>,
        ),
      );
      const vertical = host.querySelector<HTMLElement>('[data-testid="grid-vertical-scroll"]');
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      if (!vertical || !horizontal) throw new Error('Missing scroll surfaces');
      // RNW scrollTo({ y }) reaches the host as scroll({ top, left: 0 }), and scrollTo({ x }) as
      // scroll({ top: 0, left }): only the requested axis carries a nonzero offset.
      vertical.scroll = (options?: ScrollToOptions | number) => {
        if (typeof options === 'object' && options.top !== undefined) {
          requestedTops.push(options.top);
        }
      };
      horizontal.scroll = (options?: ScrollToOptions | number) => {
        if (typeof options === 'object' && options.left !== undefined) {
          requestedLefts.push(options.left);
        }
      };
    },
    scrollToAsync: async (top: number) => {
      const vertical = host.querySelector<HTMLElement>('[data-testid="grid-vertical-scroll"]');
      if (!vertical) throw new Error('Missing vertical scroll surface');
      vertical.scrollTop = top;
      // RNW drops scroll events that arrive faster than the 16ms scrollEventThrottle.
      await new Promise((resolve) => setTimeout(resolve, 20));
      await interactAsync(() =>
        vertical.dispatchEvent(new browserWindow.Event('scroll', { bubbles: true })),
      );
    },
    scrollLeftToAsync: async (left: number) => {
      const horizontal = host.querySelector<HTMLElement>('[data-testid="grid-horizontal-scroll"]');
      if (!horizontal) throw new Error('Missing horizontal scroll surface');
      horizontal.scrollLeft = left;
      await new Promise((resolve) => setTimeout(resolve, 20));
      await interactAsync(() =>
        horizontal.dispatchEvent(new browserWindow.Event('scroll', { bubbles: true })),
      );
    },
  };
}

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

/*** Resolves as soon as a condition holds, failing instead of sleeping for a fixed time. */
async function waitUntilAsync(condition: () => boolean, timeoutMilliseconds = 1000) {
  const deadline = Date.now() + timeoutMilliseconds;
  while (!condition()) {
    if (Date.now() > deadline) throw new Error('Condition was not met before the timeout.');
    await act(() => new Promise<void>((resolve) => setTimeout(resolve, 5)));
  }
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

/*** Dispatches touches whose target-local values may differ while page coordinates stay global. */
function dispatchTouchesAsync(
  browserWindow: Window,
  target: HTMLElement,
  type: 'touchcancel' | 'touchend' | 'touchstart' | 'touchmove',
  touches: readonly Readonly<{
    locationX?: number;
    locationY?: number;
    pageX: number;
    pageY: number;
  }>[],
): Promise<void> {
  const event = new browserWindow.Event(type, { bubbles: true });
  Object.defineProperty(event, 'touches', { value: touches });
  return interactAsync(() => target.dispatchEvent(event));
}
