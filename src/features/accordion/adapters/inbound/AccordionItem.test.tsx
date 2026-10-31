import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import type { ZoraProvider as ZoraProviderComponent } from '../../../theme/runtime';
import type { Accordion as AccordionComponent } from './Accordion';
import type { AccordionItem as AccordionItemComponent } from './AccordionItem';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');

test('reflects collapsed and expanded accordion state in the web DOM', async () => {
  await withBrowserRoot(async (browserWindow, host, root) => {
    const components = await loadWebAccordion();
    await renderAccordion(root, components);
    const trigger = host.querySelector('[role="button"]');
    if (!trigger) throw new Error('Expected an accordion trigger.');

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await click(browserWindow, trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    await click(browserWindow, trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

test('leaves native trigger accessibility owned by the published Surface primitive', async () => {
  const [zoraSource, surfaceTrigger] = await Promise.all([
    Bun.file(new URL('./AccordionItem.tsx', import.meta.url)).text(),
    Bun.file(
      new URL(
        '../../../../../node_modules/@ankhorage/surface/dist/features/accordion/adapters/inbound/AccordionTrigger.js',
        import.meta.url,
      ),
    ).text(),
  ]);

  expect(zoraSource).not.toContain('accessibilityState');
  expect(surfaceTrigger).toContain('accessibilityRole="button"');
  expect(surfaceTrigger).toContain(
    'accessibilityState={{ disabled: resolvedDisabled, expanded: item.open }}',
  );
});

/** Runs the web adapter through a mounted DOM root and restores its host globals. */
async function withBrowserRoot(
  callback: (
    browserWindow: Window,
    host: HTMLDivElement,
    root: ReturnType<typeof createRoot>,
  ) => Promise<void>,
) {
  const browserWindow = new Window();
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
    window: browserWindow,
    document: browserWindow.document,
    Node: browserWindow.Node,
    navigator: browserWindow.navigator,
    ShadowRoot: browserWindow.ShadowRoot,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    await callback(browserWindow, host, root);
  } finally {
    await act(() => Promise.resolve().then(() => root.unmount()));
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

/** Renders the smallest public ZORA accordion through its theme boundary. */
async function loadWebAccordion() {
  const [{ Accordion }, { AccordionItem }, { ZoraProvider }] = await Promise.all([
    import(pathToFileURL(join(webDistRoot, 'components/accordion/index.js')).href) as Promise<{
      Accordion: typeof AccordionComponent;
    }>,
    import(pathToFileURL(join(webDistRoot, 'components/accordion-item/index.js')).href) as Promise<{
      AccordionItem: typeof AccordionItemComponent;
    }>,
    import(pathToFileURL(join(webDistRoot, 'runtime/ZoraProvider.js')).href) as Promise<{
      ZoraProvider: typeof ZoraProviderComponent;
    }>,
  ]);

  return { Accordion, AccordionItem, ZoraProvider };
}

/** Renders the smallest public ZORA accordion through its theme boundary. */
function renderAccordion(
  root: ReturnType<typeof createRoot>,
  { Accordion, AccordionItem, ZoraProvider }: Awaited<ReturnType<typeof loadWebAccordion>>,
) {
  return act(() =>
    Promise.resolve().then(() =>
      root.render(
        <ZoraProvider mode="light">
          <Accordion collapsible>
            <AccordionItem title="Details" value="details">
              <div>Expanded content</div>
            </AccordionItem>
          </Accordion>
        </ZoraProvider>,
      ),
    ),
  );
}

/** Activates the mounted web trigger through React's interaction boundary. */
function click(browserWindow: Window, trigger: Element) {
  return act(() =>
    Promise.resolve().then(() => {
      trigger.dispatchEvent(new browserWindow.MouseEvent('click', { bubbles: true }));
    }),
  );
}
