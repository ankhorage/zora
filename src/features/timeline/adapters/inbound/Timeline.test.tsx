import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import type { TimelineProps } from '../../../../types/timeline';
import type { ZoraProvider as ZoraProviderComponent } from '../../../theme/runtime';
import type { Timeline as TimelineComponent } from './Timeline';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

async function loadTimeline() {
  const [timelineModule, themeModule] = await Promise.all([
    import(pathToFileURL(join(webDistRoot, 'components/timeline/index.js')).href) as Promise<{
      Timeline: typeof TimelineComponent;
    }>,
    import(pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href) as Promise<{
      ZoraProvider: typeof ZoraProviderComponent;
    }>,
  ]);
  return { Timeline: timelineModule.Timeline, ZoraProvider: themeModule.ZoraProvider };
}

function renderTimeline(
  Timeline: typeof TimelineComponent,
  ZoraProvider: typeof ZoraProviderComponent,
  items: TimelineProps['items'],
) {
  return renderToStaticMarkup(
    <ZoraProvider mode="light">
      <Timeline items={items} testID="timeline" />
    </ZoraProvider>,
  );
}

test('renders image markers while retaining icon markers as the fallback', async () => {
  const { Timeline, ZoraProvider } = await loadTimeline();
  const browser = new Window();

  try {
    browser.document.body.innerHTML = renderTimeline(Timeline, ZoraProvider, [
      {
        id: 'acquired',
        marker: 'https://example.test/acquired.svg',
        markerAlt: 'Acquired company logo',
        status: 'success',
        testID: 'acquired',
        title: 'Company acquired',
      },
      {
        icon: { name: 'checkmark-outline' },
        id: 'integrated',
        status: 'primary',
        testID: 'integrated',
        title: 'Company integrated',
      },
    ]);

    const acquired = browser.document.querySelector('[data-testid="acquired"]');
    const integrated = browser.document.querySelector('[data-testid="integrated"]');
    if (!acquired || !integrated) throw new Error('Expected both Timeline items to render');
    const imageMarker = acquired.firstElementChild?.firstElementChild;
    const iconMarker = integrated.firstElementChild?.firstElementChild;

    expect(imageMarker).not.toBeNull();
    expect(imageMarker?.getAttribute('style')).toContain('width:40px');
    expect(iconMarker).not.toBeNull();
    expect(iconMarker?.getAttribute('style')).toContain('width:20px');
  } finally {
    browser.close();
  }
});

test('stretches connectors through variable-height content without changing stable item identity', async () => {
  const { Timeline, ZoraProvider } = await loadTimeline();
  const browser = new Window();

  try {
    browser.document.body.innerHTML = renderTimeline(Timeline, ZoraProvider, [
      {
        description:
          'A deliberately long event description that wraps across lines while the connector remains continuous to the next event.',
        id: 'long-description',
        meta: '2026-11-22',
        title: 'A title that can also wrap when the available timeline width is constrained',
      },
      { id: 'final-event', title: 'Final event' },
    ]);

    const timeline = browser.document.querySelector('[data-testid="timeline"]');
    const firstItem = timeline?.children.item(0);
    const connector = firstItem?.querySelector('[style*="width:2px"]');
    const content = firstItem?.lastElementChild;

    expect(firstItem?.getAttribute('data-testid')).toBeNull();
    expect(connector?.getAttribute('style')).toContain('flex:1');
    expect(connector?.getAttribute('style')).not.toContain('height:36px');
    expect(content?.getAttribute('style')).toContain('padding-bottom:24px');
    expect(timeline?.textContent).toContain('A deliberately long event description');
    expect(timeline?.textContent).toContain('Final event');
  } finally {
    browser.close();
  }
});

test('keeps rendered item nodes stable when event order changes', async () => {
  const { Timeline, ZoraProvider } = await loadTimeline();
  const browser = new Window();
  const restore = installBrowserGlobals(browser);
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const initialItems: TimelineProps['items'] = [
    { id: 'first', testID: 'timeline-item-first', title: 'First event' },
    { id: 'second', testID: 'timeline-item-second', title: 'Second event' },
  ];

  try {
    act(() => {
      root.render(
        <ZoraProvider mode="light">
          <Timeline items={initialItems} />
        </ZoraProvider>,
      );
    });
    const firstNode = host.querySelector('[data-testid="timeline-item-first"]');
    const secondNode = host.querySelector('[data-testid="timeline-item-second"]');

    act(() => {
      root.render(
        <ZoraProvider mode="light">
          <Timeline items={[initialItems[1], initialItems[0]]} />
        </ZoraProvider>,
      );
    });

    expect(host.querySelector('[data-testid="timeline-item-first"]')).toBe(firstNode);
    expect(host.querySelector('[data-testid="timeline-item-second"]')).toBe(secondNode);
  } finally {
    act(() => root.unmount());
    host.remove();
    restore();
    browser.close();
  }
});

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
