import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ColorPicker as ColorPickerComponent } from './ColorPicker';

const webDistRoot = join(import.meta.dir, '../../../web-dist');

/*** Loads the generated public web artifact that consumers actually render. */
function load(path: string) {
  return import(pathToFileURL(join(webDistRoot, path)).href);
}

test('renders the same 8-by-8 Grid geometry in both inherited theme modes', async () => {
  const [{ ColorPicker }, { GradientRendererProvider }, { ZoraProvider }] = (await Promise.all([
    load('components/color-picker/index.js'),
    load('components/gradient-renderer-provider/index.js'),
    load('runtime/ZoraProvider.js'),
  ])) as [
    { ColorPicker: typeof ColorPickerComponent },
    {
      GradientRendererProvider: React.ComponentType<{
        readonly children?: React.ReactNode;
        readonly renderer: React.ComponentType<{ readonly children?: React.ReactNode }>;
      }>;
    },
    {
      ZoraProvider: React.ComponentType<{
        readonly children?: React.ReactNode;
        readonly mode: string;
      }>;
    },
  ];

  const markupFor = (mode: 'dark' | 'light') =>
    renderToStaticMarkup(
      <GradientRendererProvider renderer={({ children }) => <div>{children}</div>}>
        <ZoraProvider mode={mode}>
          <ColorPicker
            onDismiss={() => undefined}
            onValueChange={() => undefined}
            primaryColor="#2563eb"
            testID={`picker-${mode}`}
            width={560}
          />
        </ZoraProvider>
      </GradientRendererProvider>,
    );

  for (const mode of ['dark', 'light'] as const) {
    const browser = new Window();
    browser.document.body.innerHTML = markupFor(mode);
    try {
      const picker = browser.document.querySelector(`[data-testid="picker-${mode}"]`);
      const grid = browser.document.querySelector('[aria-label="Color grid"]');
      const swatches = grid?.querySelectorAll('[role="button"]') ?? [];

      expect(picker?.getAttribute('style')).toContain('width:560px');
      expect(browser.document.querySelector('[aria-label="Close color picker"]')).not.toBeNull();
      expect(browser.document.querySelectorAll('[aria-label="Color hex value"]')).toHaveLength(1);
      expect(grid?.getAttribute('style')).toContain('flex-wrap:wrap');
      expect(swatches).toHaveLength(64);
      expect(
        Array.from(swatches).every((swatch) =>
          swatch.getAttribute('style')?.includes('width:38.125px'),
        ),
      ).toBe(true);
    } finally {
      browser.close();
    }
  }
});
