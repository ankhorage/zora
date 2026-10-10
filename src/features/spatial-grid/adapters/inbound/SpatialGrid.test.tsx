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
  const { SpatialGrid } = await loadSpatialGrid();
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
  const markup = renderToStaticMarkup(
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
  const browserWindow = new Window();
  browserWindow.document.body.innerHTML = markup;

  try {
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
  } finally {
    browserWindow.close();
  }
});

test('emits serializable selection and activation IDs only when interactive', async () => {
  const { SpatialGrid } = await loadSpatialGrid();
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
  const selection: string[] = [];
  const activation: string[] = [];
  const root = createRoot(host);
  const render = (interactionPolicy: 'active' | 'passive') => (
    <SpatialGrid
      contentHeight={100}
      contentWidth={100}
      height={100}
      interactionPolicy={interactionPolicy}
      items={[{ height: 50, id: 'node', width: 50, x: 10, y: 20 }]}
      testID="interactive-board"
      width={100}
      onActivation={(id) => activation.push(id)}
      onSelectionChange={(id) => selection.push(id)}
      renderItem={(item) => <span>{item.id}</span>}
    />
  );

  try {
    await act(() => Promise.resolve().then(() => root.render(render('active'))));
    const activeItem = host.querySelector('[data-testid="interactive-board-item-node"]');
    if (!activeItem) throw new Error('SpatialGrid did not render its active item.');
    await act(() =>
      Promise.resolve().then(() => {
        activeItem.dispatchEvent(new browserWindow.MouseEvent('click', { bubbles: true }));
      }),
    );
    expect(selection).toEqual(['node']);
    expect(activation).toEqual(['node']);

    await act(() => Promise.resolve().then(() => root.render(render('passive'))));
    const passiveItem = host.querySelector('[data-testid="interactive-board-item-node"]');
    if (!passiveItem) throw new Error('SpatialGrid did not render its passive item.');
    await act(() =>
      Promise.resolve().then(() => {
        passiveItem.dispatchEvent(new browserWindow.MouseEvent('click', { bubbles: true }));
      }),
    );
    expect(selection).toEqual(['node']);
    expect(activation).toEqual(['node']);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
