import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { GridRectItem, GridViewport } from '@ankhorage/grid-view';
import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { GridView as GridViewComponent } from './GridView';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');
const load = (path: string) => import(pathToFileURL(join(webDistRoot, path)).href);

const world = Array.from({ length: 10_000 }, (_, index): GridRectItem => ({
  height: 10,
  id: `item-${index}`,
  width: 10,
  x: (index % 100) * 10,
  y: Math.floor(index / 100) * 10,
}));

test('virtualizes a large bounded world using independent default viewport scales', async () => {
  const { GridView } = (await load('components/grid-view/index.js')) as {
    GridView: typeof GridViewComponent;
  };
  const markup = renderGrid(GridView, {
    height: 100,
    offsetX: 200,
    offsetY: 300,
    pixelsPerUnitX: 2,
    pixelsPerUnitY: 1,
    width: 100,
  });

  expect(markup).toContain('item-3020');
  expect(markup).not.toContain('item-0');
  expect(markup).not.toContain('item-9999');
  expect(markup.match(/data-grid-item=/g)?.length).toBeLessThan(150);
});

test('renders controlled world offsets without expanding the mounted item set', async () => {
  const { GridView } = (await load('components/grid-view/index.js')) as {
    GridView: typeof GridViewComponent;
  };
  const markup = renderGrid(GridView, {
    height: 100,
    offsetX: 800,
    offsetY: 700,
    pixelsPerUnitX: 1,
    pixelsPerUnitY: 2,
    width: 100,
  });

  expect(markup).toContain('item-7080');
  expect(markup).not.toContain('item-3020');
  expect(markup.match(/data-grid-item=/g)?.length).toBeLessThan(150);
});

/*** Renders the public viewport boundary with caller-owned controlled state. */
function renderGrid(GridView: typeof GridViewComponent, viewport: GridViewport): string {
  return renderToStaticMarkup(
    <GridView
      contentHeight={1000}
      contentWidth={1000}
      height={viewport.height}
      items={world}
      overscanPixels={0}
      renderItem={(item) => <span data-grid-item={item.id}>{item.id}</span>}
      viewport={viewport}
      viewportConstraints={{ world: { height: 1000, width: 1000, x: 0, y: 0 } }}
      width={viewport.width}
    />,
  );
}
