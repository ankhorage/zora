import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { GridInteractionIntent } from '../../../../types/grid-interactions';
import type { GridInteractions as GridInteractionsComponent } from './GridInteractions';
import { GridInteractionsKeyboardProxy } from './GridInteractionsKeyboardProxy.web';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

/*** Loads the independently bundled RNW interaction adapter through its public artifact path. */
function loadGridInteractions() {
  return import(
    pathToFileURL(join(webDistRoot, 'components/grid-interactions/index.js')).href
  ) as Promise<{ GridInteractions: typeof GridInteractionsComponent }>;
}

test('keeps a mounted RNW keyboard boundary current across parent rerenders', async () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const { GridInteractions } = await loadGridInteractions();
  const firstIntents: unknown[] = [];
  const secondIntents: unknown[] = [];
  const render = (
    onIntent: (intent: unknown) => void,
    interactionPolicy?: 'passive',
    resizeHandle?: 'bottom-right',
  ) => (
    <GridInteractions
      interactionPolicy={interactionPolicy}
      items={[{ height: 2, id: 'a', width: 3, x: 1, y: 1 }]}
      onIntent={onIntent}
      selectedIds={['a']}
      testID="grid-interactions"
      resizeHandle={resizeHandle}
      viewport={{
        height: 100,
        offsetX: 0,
        offsetY: 0,
        pixelsPerUnitX: 2,
        pixelsPerUnitY: 4,
        width: 100,
      }}
    >
      <span>nested target</span>
    </GridInteractions>
  );

  try {
    await renderGridInteractions(
      root,
      render((intent) => firstIntents.push(intent)),
    );
    await renderGridInteractions(
      root,
      render((intent) => secondIntents.push(intent)),
    );

    const keyboard = host.querySelector<HTMLElement>(
      '[aria-label="Grid interaction keyboard controls"]',
    );
    if (!keyboard) throw new Error('Missing keyboard interaction proxy');
    const resize = new browser.KeyboardEvent('keydown', {
      altKey: true,
      bubbles: true,
      cancelable: true,
      key: 'ArrowRight',
    });
    await dispatch(keyboard, resize);
    const acceleratedMove = new browser.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowDown',
      shiftKey: true,
    });
    await dispatch(keyboard, acceleratedMove);
    await renderGridInteractions(
      root,
      render((intent) => secondIntents.push(intent), 'passive'),
    );
    const passiveKey = new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' });
    await dispatch(keyboard, passiveKey);
    expect(keyboard.getAttribute('tabindex')).toBe('-1');

    expect(firstIntents).toEqual([]);
    expect(secondIntents).toEqual([
      { type: 'resize', itemIds: ['a'], rects: [{ height: 2, id: 'a', width: 4, x: 1, y: 1 }] },
      { type: 'move', itemIds: ['a'], rects: [{ height: 2, id: 'a', width: 3, x: 1, y: 11 }] },
    ]);
    expect(resize.defaultPrevented).toBe(true);
    expect(acceleratedMove.defaultPrevented).toBe(true);
    expect(passiveKey.defaultPrevented).toBe(false);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    host.remove();
    browser.close();
    restore();
  }
});

test('bridges a held Space key into web responder pan and clears it for the following marquee drag', async () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const { GridInteractions } = await loadGridInteractions();
  const intents: GridInteractionIntent[] = [];

  try {
    await renderGridInteractions(
      root,
      <GridInteractions
        items={[]}
        onIntent={(intent) => intents.push(intent)}
        testID="grid-interactions"
        viewport={{
          height: 100,
          offsetX: 0,
          offsetY: 0,
          pixelsPerUnitX: 2,
          pixelsPerUnitY: 4,
          width: 100,
        }}
      >
        <span>nested target</span>
      </GridInteractions>,
    );
    const keyboard = host.querySelector<HTMLElement>(
      '[aria-label="Grid interaction keyboard controls"]',
    );
    const surface = host.querySelector<HTMLElement>('[data-testid="grid-interactions"]');
    if (!keyboard || !surface) throw new Error('Missing web grid interaction boundary');

    await dispatch(
      keyboard,
      new browser.KeyboardEvent('keydown', { bubbles: true, code: 'Space', key: ' ' }),
    );
    await drag(browser, surface, { x: 10, y: 20 }, { x: 30, y: 60 });
    await dispatch(
      keyboard,
      new browser.KeyboardEvent('keyup', { bubbles: true, code: 'Space', key: ' ' }),
    );
    await drag(browser, surface, { x: 10, y: 20 }, { x: 30, y: 60 });
    expect(intents.map((intent) => intent.type)).toEqual(['pan', 'marquee']);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    host.remove();
    browser.close();
    restore();
  }
});

test('clears the web Space modifier on blur, disable, and unmount', async () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const spaceKeyChanges: boolean[] = [];
  const onSpaceKeyChange = (spaceKey: boolean) => spaceKeyChanges.push(spaceKey);

  try {
    await renderGridInteractions(
      root,
      <GridInteractionsKeyboardProxy
        enabled
        onKeyDown={() => false}
        onSpaceKeyChange={onSpaceKeyChange}
      >
        <span>nested target</span>
      </GridInteractionsKeyboardProxy>,
    );
    const keyboard = host.querySelector<HTMLElement>(
      '[aria-label="Grid interaction keyboard controls"]',
    );
    if (!keyboard) throw new Error('Missing keyboard interaction proxy');

    await dispatch(
      keyboard,
      new browser.KeyboardEvent('keydown', { bubbles: true, code: 'Space', key: ' ' }),
    );
    await dispatch(keyboard, new browser.FocusEvent('focusout', { bubbles: true }));
    await renderGridInteractions(
      root,
      <GridInteractionsKeyboardProxy
        enabled={false}
        onKeyDown={() => false}
        onSpaceKeyChange={onSpaceKeyChange}
      >
        <span>nested target</span>
      </GridInteractionsKeyboardProxy>,
    );

    expect(spaceKeyChanges).toEqual([true, false, false]);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    expect(spaceKeyChanges.at(-1)).toBe(false);
    host.remove();
    browser.close();
    restore();
  }
});

/*** Installs the DOM globals that the independently bundled RNW adapter requires. */
function installBrowserGlobals(browser: Window): () => void {
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
    Node: browser.Node,
    ShadowRoot: browser.ShadowRoot,
    document: browser.document,
    navigator: browser.navigator,
    window: browser,
  });
  return () => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  };
}

/*** Flushes one mounted RNW render before the next synthetic input event. */
function renderGridInteractions(root: ReturnType<typeof createRoot>, component: React.ReactNode) {
  return act(() => Promise.resolve().then(() => root.render(component)));
}

/*** Dispatches one browser input event through React's RNW adapter boundary. */
function dispatch(target: HTMLElement, event: Event) {
  return act(() => Promise.resolve().then(() => target.dispatchEvent(event)));
}

/*** Runs one browser touch drag through the RNW responder boundary. */
async function drag(
  browser: Window,
  target: HTMLElement,
  start: { readonly x: number; readonly y: number },
  end: { readonly x: number; readonly y: number },
) {
  await dispatch(target, createTouchEvent(browser, 'touchstart', target, start, [start]));
  await dispatch(target, createTouchEvent(browser, 'touchmove', target, end, [end]));
  await dispatch(target, createTouchEvent(browser, 'touchend', target, end, []));
}

/*** Creates a browser touch event consumed by the RNW responder implementation. */
function createTouchEvent(
  browser: Window,
  type: 'touchend' | 'touchmove' | 'touchstart',
  target: HTMLElement,
  changed: { readonly x: number; readonly y: number },
  touches: readonly { readonly x: number; readonly y: number }[],
) {
  const event = new browser.Event(type, { bubbles: true });
  Object.defineProperties(event, {
    changedTouches: { value: [createTouch(target, changed)] },
    touches: { value: touches.map((touch) => createTouch(target, touch)) },
  });
  return event;
}

/*** Creates one RNW-compatible touch point with page and client coordinates. */
function createTouch(target: HTMLElement, point: { readonly x: number; readonly y: number }) {
  return {
    clientX: point.x,
    clientY: point.y,
    identifier: 1,
    pageX: point.x,
    pageY: point.y,
    target,
  };
}
