import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { GridViewport } from '@ankhorage/grid-view';
import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { GridLineOverlayProps, GridRulerProps } from '../../../../types/grid-rulers';
import type { ZoraProviderProps } from '../../../theme/adapters/inbound/ZoraProvider';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

/*** Loads the independently bundled React Native Web implementation under test. */
function load(path: string) {
  return import(pathToFileURL(join(webDistRoot, path)).href);
}

const viewport: GridViewport = {
  height: 100,
  offsetX: 40,
  offsetY: 20,
  pixelsPerUnitX: 2,
  pixelsPerUnitY: 2,
  width: 300,
};

const xTickSource = { kind: 'ticks' as const, specification: { mode: 'fixed' as const, step: 20 } };

/*** Renders the public native components through React Native Web for behavioral DOM assertions. */
function renderGridRulers(
  ZoraProvider: React.ComponentType<ZoraProviderProps>,
  GridRuler: React.ComponentType<GridRulerProps>,
  GridLineOverlay: React.ComponentType<GridLineOverlayProps>,
  direction: 'ltr' | 'rtl',
  guides = [{ axis: 'x' as const, id: 'playhead', label: 'Playhead', position: 60 }],
) {
  return renderToStaticMarkup(
    <ZoraProvider mode="light">
      <GridRuler
        axis="x"
        direction={direction}
        testID="ruler"
        tickSource={xTickSource}
        viewport={viewport}
      />
      <GridLineOverlay
        direction={direction}
        guides={guides}
        testID="overlay"
        viewport={viewport}
        xTickSource={xTickSource}
      />
    </ZoraProvider>,
  );
}

/*** Reads React Native Web output without relying on implementation-only geometry helpers. */
function inspectMarkup(markup: string): Window {
  const browserWindow = new Window();
  browserWindow.document.body.innerHTML = markup;
  return browserWindow;
}

test('renders ruler ticks, grid lines, and guides at the same non-zero-offset world projection in LTR and RTL', async () => {
  const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
    ZoraProvider: React.ComponentType<ZoraProviderProps>;
  };
  const { GridRuler } = (await load('components/grid-ruler/GridRuler.js')) as {
    GridRuler: React.ComponentType<GridRulerProps>;
  };
  const { GridLineOverlay } = (await load('components/grid-line-overlay/GridLineOverlay.js')) as {
    GridLineOverlay: React.ComponentType<GridLineOverlayProps>;
  };
  const ltr = inspectMarkup(renderGridRulers(ZoraProvider, GridRuler, GridLineOverlay, 'ltr'));
  const rtl = inspectMarkup(renderGridRulers(ZoraProvider, GridRuler, GridLineOverlay, 'rtl'));

  try {
    for (const [browserWindow, expectedPosition] of [
      [ltr, '40px'],
      [rtl, '260px'],
    ] as const) {
      expect(
        browserWindow.document.querySelector('[data-testid="ruler-tick-1"]')?.getAttribute('style'),
      ).toContain(`left:${expectedPosition}`);
      expect(
        browserWindow.document
          .querySelector('[data-testid="overlay-x-line-1"]')
          ?.getAttribute('style'),
      ).toContain(`left:${expectedPosition}`);
      expect(
        browserWindow.document
          .querySelector('[data-testid="overlay-guide-playhead"]')
          ?.getAttribute('style'),
      ).toContain(`left:${expectedPosition}`);
    }
  } finally {
    ltr.close();
    rtl.close();
  }
});

test('renders only finite visible guides and exposes each guide without making grid decoration navigable', async () => {
  const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
    ZoraProvider: React.ComponentType<ZoraProviderProps>;
  };
  const { GridRuler } = (await load('components/grid-ruler/GridRuler.js')) as {
    GridRuler: React.ComponentType<GridRulerProps>;
  };
  const { GridLineOverlay } = (await load('components/grid-line-overlay/GridLineOverlay.js')) as {
    GridLineOverlay: React.ComponentType<GridLineOverlayProps>;
  };
  const browserWindow = inspectMarkup(
    renderGridRulers(ZoraProvider, GridRuler, GridLineOverlay, 'ltr', [
      { axis: 'x', id: 'before', position: 39 },
      { axis: 'x', id: 'start', label: 'Start', position: 40 },
      { axis: 'x', id: 'end', label: 'End', position: 190 },
      { axis: 'x', id: 'after', position: 191 },
      { axis: 'y', id: 'invalid', position: Number.POSITIVE_INFINITY },
    ]),
  );

  try {
    expect(browserWindow.document.querySelectorAll('[data-testid^="overlay-guide-"]')).toHaveLength(
      2,
    );
    expect(
      browserWindow.document.querySelector('[data-testid="overlay-guide-start"]'),
    ).not.toBeNull();
    expect(
      browserWindow.document.querySelector('[data-testid="overlay-guide-end"]'),
    ).not.toBeNull();
    expect(browserWindow.document.querySelector('[data-testid="overlay-guide-before"]')).toBeNull();
    expect(browserWindow.document.querySelector('[data-testid="overlay-guide-after"]')).toBeNull();
    expect(
      browserWindow.document.querySelector('[data-testid="overlay"]')?.getAttribute('aria-label'),
    ).toBeNull();
    expect(
      browserWindow.document
        .querySelector('[data-testid="overlay-guide-start"]')
        ?.getAttribute('aria-label'),
    ).toBe('Grid guides: Start at 40');
    expect(
      browserWindow.document
        .querySelector('[data-testid="overlay-guide-end"]')
        ?.getAttribute('aria-label'),
    ).toBe('Grid guides: End at 190');
    expect(
      browserWindow.document
        .querySelector('[data-testid="overlay-x-line-1"]')
        ?.getAttribute('aria-label'),
    ).toBeNull();
    expect(
      browserWindow.document
        .querySelector('[data-testid="overlay-x-line-1"]')
        ?.getAttribute('role'),
    ).toBeNull();
  } finally {
    browserWindow.close();
  }
});
