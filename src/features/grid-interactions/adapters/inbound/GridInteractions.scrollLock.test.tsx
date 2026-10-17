// Drives the native GridInteractions adapter and the real ZORA ScrollView through
// react-native-web's responder system in a private happy-dom window. The module mocks are
// process-wide in Bun, so this file relies on the repository's `bun test --isolate` script;
// DOM globals are restored in afterAll.
import { afterAll, expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GridInteractionIntent } from '../../../../types/grid-interactions';

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
// The layout feature only needs these Surface primitives; the real package would load
// native-only peers, so DOM-capable react-native-web primitives stand in for them.
await mock.module('@ankhorage/surface', () => ({
  Divider: reactNativeWeb.View,
  Grid: reactNativeWeb.View,
  ScrollView: reactNativeWeb.ScrollView,
  ThemeScope: ({ children }: { readonly children: React.ReactNode }) => children,
  View: reactNativeWeb.View,
  useTheme: () => ({}),
}));
const { ScrollView } = await import('../../../layout/public');
const { GridInteractions } = await import('./GridInteractions');
const defaultScrollLockModule = await import('./useGridInteractionScrollLock');
const nativeScrollLockModule = await import('./useGridInteractionScrollLock.native');

afterAll(() => {
  browser.close();
  for (const [key, descriptor] of previousGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

const viewport = {
  height: 100,
  offsetX: 0,
  offsetY: 0,
  pixelsPerUnitX: 2,
  pixelsPerUnitY: 4,
  width: 100,
};
const items = [{ height: 2, id: 'a', width: 3, x: 1, y: 1 }];

type TouchType = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';
interface PageOptions {
  readonly interactionPolicy?: 'passive';
  readonly interactions?: boolean;
  readonly nested?: boolean;
}
interface Page {
  readonly intents: GridInteractionIntent[];
  readonly render: (options: PageOptions) => Promise<void>;
  readonly scroll: (testID: string) => Promise<boolean>;
  readonly startDrag: () => Promise<void>;
  readonly touch: (type: TouchType, pageY: number) => Promise<void>;
  readonly unmount: () => Promise<void>;
}

/*** Mounts ScrollView(s) around a GridInteractions surface and exposes observable page input. */
function mountPage(): Page {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const intents: GridInteractionIntent[] = [];
  const scrolls: string[] = [];
  const track = (id: string) => () => scrolls.push(id);
  const touch: Page['touch'] = async (type, pageY) => {
    const target = host.querySelector<HTMLElement>('[data-testid="surface"]');
    if (!target) throw new Error('Missing interaction surface');
    const point = { clientX: 5, clientY: pageY, identifier: 0, pageX: 5, pageY, target };
    const event = new browser.Event(type, { bubbles: true, cancelable: true });
    const active = type === 'touchend' || type === 'touchcancel' ? [] : [point];
    Object.defineProperty(event, 'touches', { value: active });
    Object.defineProperty(event, 'changedTouches', { value: [point] });
    await act(() => Promise.resolve().then(() => target.dispatchEvent(event)));
  };
  return {
    intents,
    render: ({ interactionPolicy, interactions = true, nested = false }) => {
      const surface = interactions ? (
        <GridInteractions
          interactionPolicy={interactionPolicy}
          items={items}
          onIntent={(intent) => intents.push(intent)}
          selectedIds={['a']}
          testID="surface"
          viewport={viewport}
        >
          <span>slate</span>
        </GridInteractions>
      ) : null;
      const page = (
        <ScrollView testID="page" onWheel={track('page')}>
          {nested ? (
            <ScrollView testID="panel" onWheel={track('panel')}>
              {surface}
            </ScrollView>
          ) : (
            surface
          )}
        </ScrollView>
      );
      return act(() => Promise.resolve().then(() => root.render(page)));
    },
    // A disabled react-native-web ScrollView stops delivering wheel input to its handlers.
    scroll: async (testID) => {
      const target = host.querySelector<HTMLElement>(`[data-testid="${testID}"]`);
      if (!target) throw new Error(`Missing ${testID}`);
      const before = scrolls.length;
      await act(() =>
        Promise.resolve().then(() =>
          target.dispatchEvent(new browser.Event('wheel', { bubbles: true })),
        ),
      );
      return scrolls.slice(before).includes(testID);
    },
    // Moving after the start only emits intents once the responder system granted ownership.
    startDrag: async () => {
      await touch('touchstart', 6);
      await touch('touchmove', 30);
      expect(intents.length).toBeGreaterThan(0);
    },
    touch,
    unmount: async () => {
      await act(() => Promise.resolve().then(() => root.unmount()));
      host.remove();
    },
  };
}

test('exercises the native scroll-lock hook rather than the web no-op adapter', () => {
  expect(defaultScrollLockModule.useGridInteractionScrollLock).toBe(
    nativeScrollLockModule.useGridInteractionScrollLock,
  );
});

test('suspends the page scroll for the whole drag and restores it on release', async () => {
  const page = mountPage();
  try {
    await page.render({});
    expect(await page.scroll('page')).toBe(true);

    await page.startDrag();
    expect(await page.scroll('page')).toBe(false);

    await page.touch('touchend', 30);
    expect(await page.scroll('page')).toBe(true);
  } finally {
    await page.unmount();
  }
});

test('restores the page scroll and ends ownership when the responder gesture is cancelled', async () => {
  const page = mountPage();
  try {
    await page.render({});
    await page.startDrag();
    expect(await page.scroll('page')).toBe(false);
    const intentsBeforeCancel = page.intents.length;

    await page.touch('touchcancel', 30);
    expect(await page.scroll('page')).toBe(true);
    await page.touch('touchmove', 60);
    expect(page.intents).toHaveLength(intentsBeforeCancel);
  } finally {
    await page.unmount();
  }
});

test('suspends both nested ScrollViews during a drag and restores both together', async () => {
  const page = mountPage();
  try {
    await page.render({ nested: true });

    await page.startDrag();
    expect(await page.scroll('panel')).toBe(false);
    expect(await page.scroll('page')).toBe(false);

    await page.touch('touchend', 30);
    expect(await page.scroll('panel')).toBe(true);
    expect(await page.scroll('page')).toBe(true);
  } finally {
    await page.unmount();
  }
});

test('releases the scroll lock when the surface unmounts mid-drag', async () => {
  const page = mountPage();
  try {
    await page.render({});
    await page.startDrag();
    expect(await page.scroll('page')).toBe(false);

    await page.render({ interactions: false });
    expect(await page.scroll('page')).toBe(true);
  } finally {
    await page.unmount();
  }
});

test('never takes ownership or the page scroll while the interaction policy is passive', async () => {
  const page = mountPage();
  try {
    await page.render({ interactionPolicy: 'passive' });

    await page.touch('touchstart', 6);
    await page.touch('touchmove', 30);
    expect(page.intents).toEqual([]);
    expect(await page.scroll('page')).toBe(true);
    await page.touch('touchend', 30);
    expect(await page.scroll('page')).toBe(true);
  } finally {
    await page.unmount();
  }
});

test('leaves no lock behind when the policy turns passive mid-drag, and locks again once active', async () => {
  const page = mountPage();
  try {
    await page.render({});
    await page.startDrag();
    expect(await page.scroll('page')).toBe(false);

    await page.render({ interactionPolicy: 'passive' });
    await page.touch('touchend', 30);
    expect(await page.scroll('page')).toBe(true);

    await page.render({});
    const intentsBeforeSecondDrag = page.intents.length;
    await page.touch('touchstart', 6);
    // A different distance, because the controller drops an intent identical to the previous one.
    await page.touch('touchmove', 40);
    expect(page.intents.length).toBeGreaterThan(intentsBeforeSecondDrag);
    expect(await page.scroll('page')).toBe(false);

    await page.touch('touchend', 30);
    expect(await page.scroll('page')).toBe(true);
  } finally {
    await page.unmount();
  }
});
