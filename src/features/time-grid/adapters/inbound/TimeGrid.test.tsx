import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { TimeGridProps } from '../../../../types/time-grid';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

function load(path: string) {
  return import(pathToFileURL(join(webDistRoot, path)).href);
}

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

test('keeps mounted interval and virtualized variable-height lane labels synchronized with GridView scrolling', async () => {
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const { TimeGrid } = (await load('components/time-grid/TimeGrid.js')) as {
    TimeGrid: React.ComponentType<TimeGridProps>;
  };
  const focusedIds: string[] = [];
  const viewportOffsets: number[] = [];

  try {
    act(() => {
      root.render(
        <TimeGrid
          contentWidth={100}
          focusedIntervalId="drums"
          height={30}
          intervals={[
            { extent: 10, id: 'drums', laneId: 'drums', start: 0 },
            { extent: 10, id: 'strings', laneId: 'strings', start: 0 },
          ]}
          lanes={[
            { height: 20, id: 'drums' },
            { height: 40, id: 'bass' },
            { height: 30, id: 'strings' },
          ]}
          onFocusedIntervalIdChange={(id) => focusedIds.push(id)}
          onViewportChange={(viewport) => viewportOffsets.push(viewport.offsetY)}
          overscanPixels={0}
          renderInterval={(interval, selected) => (
            <span data-selected={selected}>{interval.id}</span>
          )}
          renderLaneLabel={(lane) => <span>{lane.id}</span>}
          selectedIntervalIds={['drums']}
          testID="time-grid"
          width={100}
          zoom={2}
        />,
      );
    });

    expect(host.querySelector('[data-testid="time-grid-interval-drums"]')?.textContent).toBe(
      'drums',
    );
    expect(host.querySelector('[data-testid="time-grid-interval-strings"]')).toBeNull();
    expect(
      host.querySelector('[data-testid="time-grid-lane-label-drums"]')?.getAttribute('style'),
    ).toContain('height: 40px');
    expect(host.querySelector('[data-testid="time-grid-lane-label-bass"]')).toBeNull();

    const interval = host.querySelector<HTMLElement>('[data-testid="time-grid-interval-drums"]');
    if (!interval) throw new Error('Missing mounted interval');
    const arrowDown = new browser.KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowDown',
    });
    void act(() => interval.dispatchEvent(arrowDown));
    expect(arrowDown.defaultPrevented).toBe(true);
    expect(focusedIds).toEqual(['strings']);

    const verticalScroller = Array.from(host.querySelectorAll<HTMLElement>('div')).find(
      (element) =>
        element.getAttribute('style') === 'width: 200px; height: 30px;' &&
        Array.from(element.querySelectorAll('div')).some(
          (child) => child.getAttribute('style') === 'width: 200px; height: 180px;',
        ),
    );
    if (!verticalScroller) throw new Error('Missing GridView vertical scroller');
    Object.defineProperty(verticalScroller, 'scrollTop', { configurable: true, value: 60 });
    void act(() => verticalScroller.dispatchEvent(new browser.Event('scroll', { bubbles: true })));

    expect(viewportOffsets).toContain(30);
    expect(host.querySelector('[data-testid="time-grid-lane-label-drums"]')).toBeNull();
    expect(
      host.querySelector('[data-testid="time-grid-lane-label-bass"]')?.getAttribute('style'),
    ).toContain('top: -20px');
    await new Promise((resolve) => setTimeout(resolve, 100));
  } finally {
    act(() => root.unmount());
    host.remove();
    browser.close();
    restore();
  }
});
