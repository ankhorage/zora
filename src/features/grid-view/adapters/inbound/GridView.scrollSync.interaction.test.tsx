import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GridView as GridViewComponent } from './GridView';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');
const load = () => import(pathToFileURL(join(webDistRoot, 'components/grid-view/index.js')).href);
const items: readonly GridRectItem[] = [
  { height: 20, id: 'near', width: 20, x: 10, y: 10 },
  { height: 20, id: 'far', width: 20, x: 300, y: 300 },
  { height: 20, id: 'far-other', width: 20, x: 600, y: 600 },
];
const constraints = { world: { height: 1000, width: 1000, x: 0, y: 0 } };

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
