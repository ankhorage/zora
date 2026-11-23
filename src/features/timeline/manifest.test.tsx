import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { isSerializableValue, type MediaAssetRegistry, type UiNode } from '@ankhorage/contracts';
import { expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { TimelineManifestProps } from '../../types/timeline';
import type { ZoraProvider as ZoraProviderComponent } from '../theme/runtime';
import type { Timeline as TimelineComponent } from './adapters/inbound/Timeline';

const webDistRoot = join(import.meta.dir, '../../../web-dist');

const timelineRuntimePromise = Promise.all([
  import(pathToFileURL(join(webDistRoot, 'components/timeline/index.js')).href) as Promise<{
    Timeline: typeof TimelineComponent;
  }>,
  import(pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href) as Promise<{
    ZoraProvider: typeof ZoraProviderComponent;
  }>,
]);

await mock.module('react-native', () => ({
  StyleSheet: { create: <T,>(styles: T) => styles },
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
  View: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

const { RuntimeRenderer } = await import('@ankhorage/runtime');

async function loadTimelineRuntime() {
  const [timelineModule, themeModule] = await timelineRuntimePromise;
  return { Timeline: timelineModule.Timeline, ZoraProvider: themeModule.ZoraProvider };
}

const manifestTimelineProps = {
  items: [
    {
      id: 'acquired',
      title: 'Company acquired',
      description:
        'A deliberately long event description that wraps across lines while its connector flexes to the next event.',
      meta: '2026-11-22T09:00:00Z',
      status: 'success',
      marker: { mediaId: 'acquisition-mark' },
      markerAlt: 'Acquisition marker',
    },
    {
      id: 'integrated',
      title: 'Company integrated',
      meta: '2026-11-23T09:00:00Z',
      status: 'primary',
    },
  ],
} as const satisfies TimelineManifestProps;

const timelineNode = {
  id: 'acquisition-history',
  type: 'Timeline',
  props: manifestTimelineProps,
} satisfies UiNode;

const mediaAssets = {
  'acquisition-mark': {
    id: 'acquisition-mark',
    name: 'Acquisition marker',
    kind: 'image',
    source: { kind: 'url', url: 'https://example.test/acquisition.svg' },
  },
} as const satisfies MediaAssetRegistry;

test('keeps Timeline manifest items serializable and rejects executable values', () => {
  expect(isSerializableValue(manifestTimelineProps)).toBe(true);
  expect(
    isSerializableValue({
      ...manifestTimelineProps,
      items: [{ ...manifestTimelineProps.items[0], markerAlt: () => 'not serializable' }],
    }),
  ).toBe(false);
});

test('maps serializable Timeline markers through the runtime while preserving item order and connector height', async () => {
  const { Timeline, ZoraProvider } = await loadTimelineRuntime();
  const browser = new Window();

  try {
    browser.document.body.innerHTML = renderToStaticMarkup(
      <ZoraProvider mode="light">
        <RuntimeRenderer
          isRoot
          mediaAssets={mediaAssets}
          node={timelineNode}
          registry={{ Timeline }}
        />
      </ZoraProvider>,
    );

    const timeline = browser.document.querySelector('[data-testid="acquisition-history"]');
    const firstItem = timeline?.children.item(0);
    const marker = firstItem?.querySelector('[role="img"]');
    const connector = firstItem?.querySelector('[style*="width:2px"]');
    const content = firstItem?.lastElementChild;
    const text = timeline?.textContent ?? '';

    expect(marker?.getAttribute('aria-label')).toBe('Acquisition marker');
    expect(text.indexOf('Company acquired')).toBeLessThan(text.indexOf('Company integrated'));
    expect(connector?.getAttribute('style')).toContain('flex:1');
    expect(connector?.getAttribute('style')).not.toContain('height:36px');
    expect(content?.getAttribute('style')).toContain('padding-bottom:24px');
  } finally {
    browser.close();
  }
});
