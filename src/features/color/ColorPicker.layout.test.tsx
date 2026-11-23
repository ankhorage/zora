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

test('keeps the selected hue grid inside the responsive picker surface in both theme modes', async () => {
  const [{ ColorPicker }, { ZoraProvider }] = (await Promise.all([
    load('components/color-picker/index.js'),
    load('runtime/ZoraProvider.js'),
  ])) as [
    { ColorPicker: typeof ColorPickerComponent },
    {
      ZoraProvider: React.ComponentType<{
        readonly children?: React.ReactNode;
        readonly mode: string;
      }>;
    },
  ];

  const markupFor = (mode: 'dark' | 'light') =>
    renderToStaticMarkup(
      <ZoraProvider mode={mode}>
        <ColorPicker
          hue={{}}
          onDismiss={() => undefined}
          onValueChange={() => undefined}
          tabs={['wheel', 'tone', 'hue']}
          testID={`picker-${mode}`}
          value={{
            hue: '#2563eb',
            tab: 'hue',
            tone: null,
            wheel: { color: '#2563eb', harmony: null },
          }}
        />
      </ZoraProvider>,
    );

  for (const mode of ['dark', 'light'] as const) {
    const browser = new Window();
    browser.document.body.innerHTML = markupFor(mode);
    try {
      const picker = browser.document.querySelector(`[data-testid="picker-${mode}"]`);
      const scale = browser.document.querySelector('[aria-label^="Color scale previews"]');
      const swatches = scale?.querySelectorAll('[role="button"]') ?? [];

      expect(picker?.getAttribute('style')).toContain('width:100%');
      expect(picker?.getAttribute('style')).toContain('max-width:400px');
      expect(browser.document.querySelector('[aria-label="Close color picker"]')).not.toBeNull();
      expect(scale?.getAttribute('style')).toContain('flex-wrap:wrap');
      expect(swatches).toHaveLength(11);
      expect(
        Array.from(swatches).every((swatch) => swatch.getAttribute('style')?.includes('width:18%')),
      ).toBe(true);
    } finally {
      browser.close();
    }
  }
});
