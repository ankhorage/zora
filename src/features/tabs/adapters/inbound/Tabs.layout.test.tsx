import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ScrollView as ScrollViewComponent } from '../../../layout/adapters/inbound/ScrollView';
import type { ZoraProvider as ZoraProviderComponent } from '../../../theme/adapters/inbound/ZoraProvider';
import type { TabPanel as TabPanelComponent } from './TabPanel';
import type { Tabs as TabsComponent } from './Tabs';

const webDistRoot = join(import.meta.dir, '../../../../../web-dist');
const load = (path: string) => import(pathToFileURL(join(webDistRoot, path)).href);

test('renders a bounded generated Tabs panel containing the canonical ScrollView', async () => {
  const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
    ZoraProvider: typeof ZoraProviderComponent;
  };
  const { Tabs, TabPanel } = (await load('components/tabs/index.js')) as {
    Tabs: typeof TabsComponent;
    TabPanel: typeof TabPanelComponent;
  };
  const { ScrollView } = (await load('components/scroll-view/index.js')) as {
    ScrollView: typeof ScrollViewComponent;
  };
  const markup = renderToStaticMarkup(
    <ZoraProvider mode="light">
      <Tabs defaultValue="tree" flex={1} minHeight={0} overflow="hidden" testID="sidebar">
        <TabPanel flex={1} minHeight={0} testID="tree-panel" value="tree">
          <ScrollView flex={1} minHeight={0} testID="tree-scroll">
            <span>Deep tree</span>
          </ScrollView>
        </TabPanel>
        <TabPanel value="rules">
          <span>Hidden rules</span>
        </TabPanel>
      </Tabs>
    </ZoraProvider>,
  );
  const browserWindow = new Window();
  browserWindow.document.body.innerHTML = markup;
  const shell = browserWindow.document.querySelector('[data-testid="sidebar"]');
  const panel = browserWindow.document.querySelector('[data-testid="tree-panel"]');
  const scroll = browserWindow.document.querySelector('[data-testid="tree-scroll"]');

  expect(shell?.getAttribute('style')).toContain('flex:1');
  expect(shell?.getAttribute('style')).toContain('min-height:0px');
  expect(shell?.getAttribute('style')).toContain('overflow-y:hidden');
  expect(panel?.getAttribute('style')).toContain('flex:1');
  expect(panel?.getAttribute('style')).toContain('min-height:0px');
  expect(panel?.getAttribute('role')).toBe('tabpanel');
  expect(scroll?.parentElement).toBe(panel);
  expect(browserWindow.document.body.textContent).not.toContain('Hidden rules');
  browserWindow.close();
});
