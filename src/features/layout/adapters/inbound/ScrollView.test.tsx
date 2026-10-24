// Renders the real ZORA ScrollView through react-native-web in a private happy-dom window.
// The module mocks below are process-wide in Bun, so this file relies on the repository's
// `bun test --isolate` script; DOM globals are restored in afterAll.
import { afterAll, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ScrollGestureLock } from '../../../../types/layout';

const browser = new Window();
const globalKeys = [
  'window',
  'document',
  'Node',
  'navigator',
  'ShadowRoot',
  'IS_REACT_ACT_ENVIRONMENT',
] as const;
const previousGlobals = globalKeys.map(
  (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
);
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  Node: browser.Node,
  ShadowRoot: browser.ShadowRoot,
  document: browser.document,
  navigator: browser.navigator,
  window: browser,
});

const reactNativeWeb = await import('react-native-web');
await mock.module('react-native', () => reactNativeWeb);
// ZORA's ScrollView only needs Surface's ScrollView and ThemeScope; the real package would load
// native-only peers, so the DOM-capable react-native-web ScrollView stands in for the primitive.
type SurfaceScrollViewProps = React.ComponentProps<typeof reactNativeWeb.ScrollView> & {
  readonly onRefresh?: () => void;
  readonly refreshing?: boolean;
};

const surfaceScrollViewProps: SurfaceScrollViewProps[] = [];

await mock.module('@ankhorage/surface', () => ({
  ScrollView: (props: SurfaceScrollViewProps) => {
    surfaceScrollViewProps.push(props);
    return React.createElement(reactNativeWeb.ScrollView, props);
  },
  ThemeScope: ({ children }: { readonly children: React.ReactNode }) => children,
}));
const { ScrollView } = await import('./ScrollView');
const { useScrollGestureLock } = await import('./useScrollGestureLock');

afterAll(() => {
  browser.close();
  for (const [key, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

interface Mounted {
  readonly deliveredScrolls: string[];
  readonly locks: Map<string, ScrollGestureLock>;
  readonly render: (element: React.ReactNode) => Promise<void>;
  readonly swipe: (testID: string) => Promise<boolean>;
  readonly unmount: () => Promise<void>;
}

/*** Mounts elements in a fresh container and records which ScrollViews still receive scroll input. */
function mount(): Mounted {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const deliveredScrolls: string[] = [];
  const locks = new Map<string, ScrollGestureLock>();
  return {
    deliveredScrolls,
    locks,
    render: (element) => act(() => Promise.resolve().then(() => root.render(element))),
    // A disabled react-native-web ScrollView stops delivering wheel input to its handlers.
    swipe: async (testID) => {
      const target = host.querySelector<HTMLElement>(`[data-testid="${testID}"]`);
      if (!target) throw new Error(`Missing ${testID}`);
      const before = deliveredScrolls.length;
      await act(() =>
        Promise.resolve().then(() =>
          target.dispatchEvent(new browser.Event('wheel', { bubbles: true })),
        ),
      );
      // Bubbling may also reach an enabled ancestor, so only the scrolled ScrollView counts.
      return deliveredScrolls.slice(before).includes(testID);
    },
    unmount: async () => {
      await act(() => Promise.resolve().then(() => root.unmount()));
      host.remove();
    },
  };
}

/*** Renders a tracked ZORA ScrollView whose descendants can reach its gesture lock. */
function TrackedScrollView({
  children,
  id,
  mounted,
  scrollEnabled,
}: {
  readonly children?: React.ReactNode;
  readonly id: string;
  readonly mounted: Mounted;
  readonly scrollEnabled?: boolean;
}) {
  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      testID={id}
      onWheel={() => mounted.deliveredScrolls.push(id)}
    >
      <LockProbe id={`${id}-lock`} mounted={mounted} />
      {children}
    </ScrollView>
  );
}

/*** Publishes the nearest ScrollView gesture lock under a stable name. */
function LockProbe({ id, mounted }: { readonly id: string; readonly mounted: Mounted }) {
  mounted.locks.set(id, useScrollGestureLock());
  return null;
}

/*** Acquires a lock inside React's act boundary so the ScrollView state update flushes. */
async function acquire(mounted: Mounted, id: string): Promise<() => Promise<void>> {
  let release: (() => void) | undefined;
  await act(() =>
    Promise.resolve().then(() => {
      release = mounted.locks.get(id)?.acquire();
    }),
  );
  return () =>
    act(() =>
      Promise.resolve().then(() => {
        release?.();
      }),
    );
}

test('delivers scroll input to an unlocked ScrollView and suspends it while a descendant holds the lock', async () => {
  const mounted = mount();
  try {
    await mounted.render(<TrackedScrollView id="page" mounted={mounted} />);
    expect(await mounted.swipe('page')).toBe(true);

    const release = await acquire(mounted, 'page-lock');
    expect(await mounted.swipe('page')).toBe(false);

    await release();
    expect(await mounted.swipe('page')).toBe(true);
  } finally {
    await mounted.unmount();
  }
});

test('suspends every ancestor ScrollView of a nested gesture and restores them together', async () => {
  const mounted = mount();
  try {
    await mounted.render(
      <TrackedScrollView id="outer" mounted={mounted}>
        <TrackedScrollView id="inner" mounted={mounted} />
      </TrackedScrollView>,
    );

    const release = await acquire(mounted, 'inner-lock');
    expect(await mounted.swipe('inner')).toBe(false);
    expect(await mounted.swipe('outer')).toBe(false);

    await release();
    expect(await mounted.swipe('inner')).toBe(true);
    expect(await mounted.swipe('outer')).toBe(true);
  } finally {
    await mounted.unmount();
  }
});

test('does not suspend sibling ScrollViews or the descendants of an outer ScrollView that did not lock', async () => {
  const mounted = mount();
  try {
    await mounted.render(
      <>
        <TrackedScrollView id="left" mounted={mounted} />
        <TrackedScrollView id="right" mounted={mounted} />
      </>,
    );

    const release = await acquire(mounted, 'left-lock');
    expect(await mounted.swipe('left')).toBe(false);
    expect(await mounted.swipe('right')).toBe(true);

    await release();
    expect(await mounted.swipe('left')).toBe(true);
  } finally {
    await mounted.unmount();
  }
});

test('keeps scrolling suspended until every simultaneous owner has released, and ignores double releases', async () => {
  const mounted = mount();
  try {
    await mounted.render(<TrackedScrollView id="page" mounted={mounted} />);

    const releaseFirst = await acquire(mounted, 'page-lock');
    const releaseSecond = await acquire(mounted, 'page-lock');
    await releaseFirst();
    expect(await mounted.swipe('page')).toBe(false);

    await releaseFirst();
    expect(await mounted.swipe('page')).toBe(false);

    await releaseSecond();
    expect(await mounted.swipe('page')).toBe(true);

    const releaseThird = await acquire(mounted, 'page-lock');
    expect(await mounted.swipe('page')).toBe(false);
    await releaseThird();
    expect(await mounted.swipe('page')).toBe(true);
  } finally {
    await mounted.unmount();
  }
});

test('never re-enables a ScrollView that the caller disabled explicitly', async () => {
  const mounted = mount();
  try {
    await mounted.render(<TrackedScrollView id="page" mounted={mounted} scrollEnabled={false} />);
    expect(await mounted.swipe('page')).toBe(false);

    const release = await acquire(mounted, 'page-lock');
    await release();
    expect(await mounted.swipe('page')).toBe(false);

    await mounted.render(<TrackedScrollView id="page" mounted={mounted} scrollEnabled />);
    expect(await mounted.swipe('page')).toBe(true);
  } finally {
    await mounted.unmount();
  }
});

test('forwards controlled refresh state and does not simulate a native pull gesture on web', async () => {
  const mounted = mount();
  const refreshSignals: undefined[] = [];
  const onRefresh = () => refreshSignals.push(undefined);
  try {
    await mounted.render(
      <ScrollView refreshing={false} onRefresh={onRefresh} testID="refreshable-scroll-view" />,
    );
    expect(surfaceScrollViewProps.at(-1)?.refreshing).toBe(false);
    expect(surfaceScrollViewProps.at(-1)?.onRefresh).toBe(onRefresh);

    await mounted.swipe('refreshable-scroll-view');
    expect(refreshSignals).toEqual([]);

    surfaceScrollViewProps.at(-1)?.onRefresh?.();
    expect(refreshSignals).toEqual([undefined]);

    await mounted.render(
      <ScrollView refreshing onRefresh={onRefresh} testID="refreshable-scroll-view" />,
    );
    expect(surfaceScrollViewProps.at(-1)?.refreshing).toBe(true);

    await mounted.render(
      <ScrollView refreshing={false} onRefresh={onRefresh} testID="refreshable-scroll-view" />,
    );
    expect(surfaceScrollViewProps.at(-1)?.refreshing).toBe(false);
  } finally {
    await mounted.unmount();
  }
});

test('suppresses pull-to-refresh while the interaction policy is passive', async () => {
  const mounted = mount();
  const onRefresh = () => undefined;
  try {
    await mounted.render(
      <ScrollView
        interactionPolicy="passive"
        onRefresh={onRefresh}
        testID="passive-refreshable-scroll-view"
      />,
    );

    expect(surfaceScrollViewProps.at(-1)?.onRefresh).toBeUndefined();
  } finally {
    await mounted.unmount();
  }
});
