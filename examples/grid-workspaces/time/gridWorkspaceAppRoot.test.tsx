import { expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const [{ ZoraProvider }, { Button }, { Screen }, { ScreenSection }, { View }] = await Promise.all([
  import('../../../web-dist/runtime/ZoraProvider.js'),
  import('../../../web-dist/components/button/Button.js'),
  import('../../../web-dist/components/screen/Screen.js'),
  import('../../../web-dist/components/screen-section/ScreenSection.js'),
  import('../../../web-dist/components/view/View.js'),
]);
const Empty = () => null;
const zora = {
  Button,
  FileExplorer: Empty,
  MediaExplorer: Empty,
  Screen,
  ScreenSection,
  Uploader: Empty,
  View,
  ZoraProvider,
};

mock.module('@ankhorage/zora', () => zora);
mock.module('../GridRulersScenario', () => ({ GridRulersScenario: Empty }));
mock.module('../interactions/GridInteractionsScenario', () => ({
  GridInteractionsScenario: Empty,
}));
mock.module('../matrix/PianoRollMatrixScenario', () => ({ PianoRollMatrixScenario: Empty }));
mock.module('../matrix/SpreadsheetMatrixScenario', () => ({ SpreadsheetMatrixScenario: Empty }));
mock.module('../spatial/SpatialGridScenario', () => ({ SpatialGridScenario: Empty }));
mock.module('../time/DawArrangerScenario', () => ({ DawArrangerScenario: Empty }));
mock.module('../time/SchedulerGanttScenario', () => ({ SchedulerGanttScenario: Empty }));

const { default: App } = await import('../App');

const browserKeys = [
  'window',
  'document',
  'Node',
  'navigator',
  'ShadowRoot',
  'IS_REACT_ACT_ENVIRONMENT',
] as const;
const scenarioLabels = ['Spreadsheet', 'Spatial canvas', 'Interactions'] as const;

/*** Mounts the Grid Workspaces application through React Native Web and restores the ambient DOM. */
async function withGridWorkspaceDom(
  assertion: (host: HTMLElement, browser: Window) => Promise<void>,
) {
  const browser = new Window();
  const previous = browserKeys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browser,
    document: browser.document,
    Node: browser.Node,
    navigator: browser.navigator,
    ShadowRoot: browser.ShadowRoot,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  try {
    await assertion(host, browser);
  } finally {
    browser.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

/*** Finds a React Native Web button by its accessible scenario label. */
function findScenarioButton(host: HTMLElement, label: string) {
  return Array.from(host.querySelectorAll('[role="button"]')).find(
    (button) => button.textContent === label,
  );
}

test('mounts Grid Workspaces in ZoraProvider and keeps runtime context through scenario changes', async () => {
  await withGridWorkspaceDom(async (host, browser) => {
    const root = createRoot(host);
    const errors: unknown[][] = [];
    const consoleError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args);
    };
    try {
      await act(async () => {
        root.render(<App />);
      });
      expect(host.textContent).toContain('Grid workspaces');

      for (const label of scenarioLabels) {
        const button = findScenarioButton(host, label);
        expect(button).toBeDefined();
        await act(async () => {
          button?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
        });
      }

      expect(errors.flat().map(String).join('\n')).not.toContain('must be used within a');
    } finally {
      console.error = consoleError;
      await act(async () => {
        root.unmount();
      });
    }
  });
});
