import { strict as assert } from 'node:assert';
import { chmod, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Window } from 'happy-dom';

import { create } from '../../src/cli/commands/create';
import { sync } from '../../src/cli/commands/sync';
import { createWebDesiredStateWithNodeAsync } from '../../src/features/web-component-artifact/composition/createWebDesiredStateWithNodeAsync';

const packageRoot = join(import.meta.dir, '..', '..');
const projectRoot = await mkdtemp(join(packageRoot, 'node_modules', '.zora-web-acceptance-'));
const outputDirectory = join(projectRoot, '.ankh', 'zora', 'web');
const components = [
  'app-bar',
  'button',
  'card-back',
  'card-hand',
  'chess-board',
  'date-picker',
  'graph-view',
  'opening-book',
  'playing-card',
  'poker-training-table',
  'select',
  'tabletop-table',
  'text',
  'tree-view',
];

try {
  const context = {
    cwd: projectRoot,
    writeStdout() {},
    writeStderr(message: string) {
      throw new Error(message);
    },
  };
  assert.equal((await create({ argv: ['select', '--web'], context })).exitCode, 0);
  assert.deepEqual(
    JSON.parse(await readFile(join(projectRoot, 'zora.web.json'), 'utf8')).components,
    ['select'],
  );
  const initialDesired = await readFile(join(projectRoot, 'zora.web.json'), 'utf8');
  const initialEvidence = await readFile(join(outputDirectory, 'materialization.json'), 'utf8');
  await assert.rejects(
    createWebDesiredStateWithNodeAsync({ component: 'not-a-component', projectRoot }),
    /Unsupported ZORA web component/u,
  );
  assert.equal(await readFile(join(projectRoot, 'zora.web.json'), 'utf8'), initialDesired);
  assert.equal(
    await readFile(join(outputDirectory, 'materialization.json'), 'utf8'),
    initialEvidence,
  );
  if (process.platform !== 'win32') {
    await chmod(projectRoot, 0o555);
    try {
      await assert.rejects(
        createWebDesiredStateWithNodeAsync({ component: 'button', projectRoot }),
      );
    } finally {
      await chmod(projectRoot, 0o755);
    }
    assert.equal(await readFile(join(projectRoot, 'zora.web.json'), 'utf8'), initialDesired);
    assert.equal(
      await readFile(join(outputDirectory, 'materialization.json'), 'utf8'),
      initialEvidence,
    );
  }
  await writeFile(
    join(projectRoot, 'zora.web.json'),
    `${JSON.stringify({ schemaVersion: 1, components })}\n`,
  );
  await rm(join(projectRoot, '.ankh'), { force: true, recursive: true });
  assert.equal((await sync({ argv: ['--web'], context })).exitCode, 0);
  const evidence = JSON.parse(
    await readFile(join(outputDirectory, 'materialization.json'), 'utf8'),
  ) as {
    readonly files: readonly string[];
    readonly components: readonly string[];
  };
  const firstEvidence = await readFile(join(outputDirectory, 'materialization.json'), 'utf8');
  assert.equal((await sync({ argv: ['--web'], context })).exitCode, 0);
  assert.equal(
    await readFile(join(outputDirectory, 'materialization.json'), 'utf8'),
    firstEvidence,
  );
  assert.deepEqual(evidence.components, components);
  assert(evidence.files.some((file) => file.startsWith('chunks/')));
  assert(evidence.files.includes('components/select/index.js'));
  assert(!evidence.files.some((file) => file.includes('node_modules')));

  const browser = new Window();
  Object.assign(globalThis, {
    window: browser,
    document: browser.document,
    navigator: browser.navigator,
    HTMLElement: browser.HTMLElement,
    ShadowRoot: browser.ShadowRoot,
    Node: browser.Node,
    Element: browser.Element,
    MutationObserver: browser.MutationObserver,
    getComputedStyle: browser.getComputedStyle.bind(browser),
    requestAnimationFrame: browser.requestAnimationFrame.bind(browser),
    cancelAnimationFrame: browser.cancelAnimationFrame.bind(browser),
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const React = await import('react');
  const { hydrateRoot } = await import('react-dom/client');
  const { renderToString } = await import('react-dom/server');
  const load = async (file: string) =>
    await import(pathToFileURL(join(outputDirectory, file)).href);
  const { ZoraProvider, useZoraTheme } = await load('runtime/ZoraProvider.js');
  const { Select } = await load('components/select/index.js');
  const { Button } = await load('components/button/index.js');
  const { Text } = await load('components/text/index.js');
  const { AppBar } = await load('components/app-bar/index.js');
  const { DatePicker } = await load('components/date-picker/index.js');
  const { GraphView } = await load('components/graph-view/index.js');
  const { TreeView } = await load('components/tree-view/index.js');
  const { ChessBoard } = await load('components/chess-board/index.js');
  const { OpeningBook } = await load('components/opening-book/index.js');
  const { CardBack } = await load('components/card-back/index.js');
  const { CardHand } = await load('components/card-hand/index.js');
  const { PlayingCard } = await load('components/playing-card/index.js');
  const { TabletopTable } = await load('components/tabletop-table/index.js');
  const { PokerTrainingTable } = await load('components/poker-training-table/index.js');
  assert.equal(typeof AppBar, 'function');
  assert.equal(typeof DatePicker, 'function');
  assert.equal(typeof GraphView, 'function');
  assert.equal(typeof TreeView, 'function');
  assert.equal(typeof ChessBoard, 'function');
  assert.equal(typeof OpeningBook, 'function');
  assert.equal(typeof CardBack, 'function');
  assert.equal(typeof CardHand, 'function');
  assert.equal(typeof PlayingCard, 'function');
  assert.equal(typeof TabletopTable, 'function');
  assert.equal(typeof PokerTrainingTable, 'function');
  assert.equal(typeof useZoraTheme, 'function');

  function ThemeProbe() {
    const runtime = useZoraTheme();
    return React.createElement(
      'span',
      {
        'data-testid': 'theme-probe',
        'data-mode': runtime.mode,
        'data-primary': runtime.theme.colors.primary,
      },
      runtime.mode,
    );
  }

  function TestApp({ mode }: { readonly mode: 'light' | 'dark' }) {
    const [value, setValue] = React.useState('grid');
    return React.createElement(
      ZoraProvider,
      { mode },
      React.createElement(ThemeProbe),
      React.createElement(AppBar, { title: 'Workspace' }),
      React.createElement(Text, { testID: 'mode-text' }, 'Ready'),
      React.createElement(Button, null, 'Action'),
      React.createElement(Select, {
        value,
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'Circle', value: 'circle' },
        ],
        onValueChange: setValue,
        testID: 'layout',
      }),
    );
  }

  const app = React.createElement(TestApp, { mode: 'light' });
  const markup = renderToString(app);
  browser.document.body.innerHTML = `<div id="root">${markup}</div>`;
  const hydrationErrors: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.map(String).join(' ');
    if (message.includes('hydration') || message.includes('Hydration')) {
      hydrationErrors.push(message);
    }
    originalError(...args);
  };
  try {
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await React.act(async () => {
      root = hydrateRoot(browser.document.getElementById('root')!, app);
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    assert.deepEqual(hydrationErrors, []);
    assert(browser.document.body.textContent?.includes('Workspace'));
    assert.equal(
      browser.document.querySelector('[data-testid="theme-probe"]')?.getAttribute('data-mode'),
      'light',
    );
    assert(
      browser.document.querySelector('[data-testid="theme-probe"]')?.getAttribute('data-primary'),
    );
    await React.act(async () => {
      browser.document
        .querySelector('[data-testid="layout-trigger"]')
        ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 40));
    });
    assert(browser.document.querySelector('[data-testid="layout-option-circle"]'));
    await React.act(async () => {
      browser.document
        .querySelector('[data-testid="layout-option-circle"]')
        ?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    assert(
      browser.document
        .querySelector('[data-testid="layout-trigger"]')
        ?.textContent?.includes('Circle'),
    );
    const lightColor = browser.document
      .querySelector('[data-testid="mode-text"]')
      ?.getAttribute('style');
    await React.act(async () => {
      root?.render(React.createElement(TestApp, { mode: 'dark' }));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    const darkColor = browser.document
      .querySelector('[data-testid="mode-text"]')
      ?.getAttribute('style');
    assert.equal(
      browser.document.querySelector('[data-testid="theme-probe"]')?.getAttribute('data-mode'),
      'dark',
    );
    assert.notEqual(darkColor, lightColor);
    assert(
      browser.document
        .querySelector('[data-testid="layout-trigger"]')
        ?.textContent?.includes('Circle'),
    );
  } finally {
    console.error = originalError;
  }
  process.stdout.write(
    'Materialized ZORA provider, SSR hydration, and Select interaction passed.\n',
  );
} finally {
  await rm(projectRoot, { force: true, recursive: true });
}
