import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ZoraProvider as ZoraProviderComponent } from '../../../theme/runtime';
import type { Calendar as CalendarComponent } from './Calendar';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

test('selects adjacent days through the locked GridView in regular and compact calendars', async () => {
  const [{ Calendar }, { ZoraProvider }] = (await Promise.all([
    import(pathToFileURL(join(webDistRoot, 'components', 'calendar', 'index.js')).href),
    import(pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href),
  ])) as [{ Calendar: typeof CalendarComponent }, { ZoraProvider: typeof ZoraProviderComponent }];

  await withBrowserAsync(async (host) => {
    const selections: string[] = [];
    const displayedMonths: string[] = [];
    const root = createRoot(host);
    try {
      await interactAsync(() =>
        root.render(
          <ZoraProvider mode="light">
            <Calendar
              defaultDisplayedMonth={new Date(2024, 1, 1)}
              density="regular"
              onDisplayedMonthChange={(month) => displayedMonths.push(formatDate(month))}
              onSelectedDateChange={(date) => selections.push(formatDate(date))}
              testID="regular-calendar"
            />
            <Calendar
              defaultDisplayedMonth={new Date(2024, 1, 1)}
              density="compact"
              onDisplayedMonthChange={(month) => displayedMonths.push(formatDate(month))}
              onSelectedDateChange={(date) => selections.push(formatDate(date))}
              testID="compact-calendar"
            />
          </ZoraProvider>,
        ),
      );

      const regularGrid = host.querySelector<HTMLElement>('[data-testid="regular-calendar-grid"]');
      const compactGrid = host.querySelector<HTMLElement>('[data-testid="compact-calendar-grid"]');
      const regularAdjacent = host.querySelector<HTMLButtonElement>(
        '[data-testid="regular-calendar-day-2024-03-01"]',
      );
      const compactAdjacent = host.querySelector<HTMLButtonElement>(
        '[data-testid="compact-calendar-day-2024-03-02"]',
      );
      if (!regularGrid || !compactGrid || !regularAdjacent || !compactAdjacent) {
        throw new Error('Missing Calendar GridView or adjacent month controls');
      }

      expect(
        regularGrid.querySelector('[data-testid="regular-calendar-day-2024-03-01"]'),
      ).not.toBeNull();
      expect(
        compactGrid.querySelector('[data-testid="compact-calendar-day-2024-03-02"]'),
      ).not.toBeNull();
      expect(regularAdjacent.style.borderWidth).not.toBe('0px');
      expect(compactAdjacent.style.borderWidth).not.toBe('0px');

      await interactAsync(() => regularAdjacent.click());
      await interactAsync(() => compactAdjacent.click());

      expect(selections).toEqual(['2024-03-01', '2024-03-02']);
      expect(displayedMonths).toEqual(['2024-03-01', '2024-03-01']);
    } finally {
      await interactAsync(() => root.unmount());
    }
  });
});

/*** Executes a React interaction after the renderer has a chance to flush effects. */
function interactAsync(action: () => void): Promise<void> {
  return act(() => Promise.resolve().then(action));
}

/*** Formats a local Date for observable Calendar selection assertions. */
function formatDate(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
    value.getDate(),
  ).padStart(2, '0')}`;
}

/*** Mounts an isolated browser surface and restores global DOM bindings after a test. */
async function withBrowserAsync(testBrowser: (host: HTMLElement) => Promise<void>): Promise<void> {
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
  try {
    await testBrowser(host);
  } finally {
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}
