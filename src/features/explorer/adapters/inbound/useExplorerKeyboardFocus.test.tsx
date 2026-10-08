import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ExplorerItem } from '../../../../types/explorer';
import { layoutTileGrid } from '../../../grid-view/application/layoutTileGrid';
import { ExplorerKeyboardProxy } from './ExplorerKeyboardProxy.web';
import { useExplorerKeyboardFocus } from './useExplorerKeyboardFocus';

interface HarnessProps {
  readonly items: readonly ExplorerItem[];
  readonly mountedIds: readonly string[];
  readonly columns: number;
  readonly navigation: { origin: string; target: string; extend: boolean }[];
}

function FocusHarness({ items, mountedIds, columns, navigation }: HarnessProps) {
  const keyboard = useExplorerKeyboardFocus(items, columns, false, (target, origin, extend) => {
    navigation.push({ origin, target, extend });
  });
  return (
    <div>
      {mountedIds.map((id) => (
        <ExplorerKeyboardProxy
          key={id}
          onKeyDown={(key, shiftKey) => keyboard.onKeyDown(id, key, shiftKey)}
        >
          <button
            data-tile={id}
            onFocus={() => keyboard.onFocus(id)}
            ref={(node) => keyboard.registerTile(id, node)}
            tabIndex={id === keyboard.tabStopId ? 0 : -1}
            type="button"
          >
            {id}
          </button>
        </ExplorerKeyboardProxy>
      ))}
    </div>
  );
}

test('restores native DOM focus only after a far virtual tile mounts', () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const navigation: { origin: string; target: string; extend: boolean }[] = [];
  const items = Array.from({ length: 10000 }, (_, i): ExplorerItem => ({
    id: `tile-${i}`,
    name: `Tile ${i}`,
    kind: 'image',
  }));
  const render = (mountedIds: string[]) => (
    <FocusHarness columns={4} items={items} mountedIds={mountedIds} navigation={navigation} />
  );

  try {
    act(() => root.render(render(['tile-0', 'tile-1', 'tile-2', 'tile-3'])));
    const first = host.querySelector<HTMLButtonElement>('[data-tile="tile-0"]');
    if (!first) throw new Error('Missing first tile');
    act(() => first.focus());

    const event = new browser.KeyboardEvent('keydown', {
      key: 'End',
      bubbles: true,
      cancelable: true,
    });
    act(() => first.dispatchEvent(event));

    expect(event.defaultPrevented).toBe(true);
    expect(navigation).toEqual([{ origin: 'tile-0', target: 'tile-9999', extend: false }]);
    expect(host.querySelector('[data-tile="tile-9999"]')).toBeNull();

    act(() => root.render(render(['tile-9996', 'tile-9997', 'tile-9998', 'tile-9999'])));
    expect(document.activeElement?.getAttribute('data-tile')).toBe('tile-9999');
    expect(host.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
  } finally {
    act(() => root.unmount());
    host.remove();
    browser.close();
    restore();
  }
});

test('rapid navigation cancels a pending focus and handles resize, range and unavailable tiles', () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const navigation: { origin: string; target: string; extend: boolean }[] = [];
  const items: readonly ExplorerItem[] = [
    { id: 'a', name: 'A', kind: 'file' },
    { id: 'b', name: 'B', kind: 'file' },
    { id: 'c', name: 'C', kind: 'file', disabled: true },
    { id: 'd', name: 'D', kind: 'file' },
    { id: 'e', name: 'E', kind: 'file' },
    { id: 'f', name: 'F', kind: 'file' },
  ];
  const render = (width: number, mountedIds: string[]) => (
    <FocusHarness
      columns={layoutTileGrid(items, width, 100, 10).columns}
      items={items}
      mountedIds={mountedIds}
      navigation={navigation}
    />
  );
  try {
    act(() => root.render(render(450, ['a', 'b', 'c', 'd'])));
    const first = host.querySelector<HTMLButtonElement>('[data-tile="a"]');
    if (!first) throw new Error('Missing first tile');
    act(() => first.focus());

    act(() =>
      first.dispatchEvent(
        new browser.KeyboardEvent('keydown', {
          key: 'ArrowDown',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    expect(navigation.at(-1)).toEqual({ origin: 'a', target: 'e', extend: true });

    act(() => root.render(render(230, ['a', 'b', 'c', 'd'])));
    act(() =>
      first.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Home', bubbles: true })),
    );
    act(() =>
      first.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })),
    );
    expect(navigation.at(-1)).toEqual({ origin: 'a', target: 'd', extend: false });

    act(() =>
      first.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'End', bubbles: true })),
    );
    act(() =>
      first.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Home', bubbles: true })),
    );
    act(() => root.render(render(230, ['a', 'b', 'c', 'd', 'e', 'f'])));
    expect(document.activeElement?.getAttribute('data-tile')).toBe('a');
    expect(host.querySelectorAll('[tabindex="0"]')).toHaveLength(1);
    expect(host.querySelector<HTMLButtonElement>('[data-tile="c"]')?.tabIndex).toBe(-1);
  } finally {
    act(() => root.unmount());
    host.remove();
    browser.close();
    restore();
  }
});

test('web proxy leaves non-navigation keys to ordinary activation', () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  try {
    act(() =>
      root.render(
        <ExplorerKeyboardProxy onKeyDown={(key) => key === 'ArrowRight'}>
          <button type="button">Action</button>
        </ExplorerKeyboardProxy>,
      ),
    );
    const button = host.querySelector('button');
    if (!button) throw new Error('Missing action');
    const arrow = new browser.KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    act(() => button.dispatchEvent(arrow));
    expect(arrow.defaultPrevented).toBe(true);

    const enter = new browser.KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    });
    act(() => button.dispatchEvent(enter));
    expect(enter.defaultPrevented).toBe(false);
  } finally {
    act(() => root.unmount());
    host.remove();
    browser.close();
    restore();
  }
});

/*** Install a deterministic RNW-like browser environment for real focus and event propagation. */
function installBrowserGlobals(browser: Window): () => void {
  const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    window: browser,
    document: browser.document,
    Node: browser.Node,
    navigator: browser.navigator,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  return () => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  };
}
