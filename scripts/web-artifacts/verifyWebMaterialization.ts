import { strict as assert } from 'node:assert';
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Window } from 'happy-dom';

import { create } from '../../src/cli/commands/create';
import { sync } from '../../src/cli/commands/sync';
import { createWebDesiredStateWithNodeAsync } from '../../src/features/web-component-artifact/composition/createWebDesiredStateWithNodeAsync';
import { discoverWebArtifactTargets } from './discoverWebArtifactTargets';

const packageRoot = join(import.meta.dir, '..', '..');
const projectRoot = await mkdtemp(join(packageRoot, 'node_modules', '.zora-web-acceptance-'));
const outputDirectory = join(projectRoot, '.ankh', 'zora', 'web');
const publicFeatureTargets = await discoverWebArtifactTargets({
  featuresRoot: join(packageRoot, 'src', 'features'),
  repositoryRoot: packageRoot,
  sourceRoot: join(packageRoot, 'src'),
});
const components = [
  ...new Set([
    'app-bar',
    'button',
    'date-picker',
    'graph-view',
    'select',
    'text',
    'tree-view',
    ...publicFeatureTargets.map((target) => target.component),
  ]),
].sort();

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
  assert.equal((await create({ argv: ['reader', '--web'], context })).exitCode, 0);
  assert.deepEqual(
    JSON.parse(await readFile(join(projectRoot, 'zora.web.json'), 'utf8')).components,
    ['reader', 'select'],
  );
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
  for (const component of components) {
    assert(evidence.files.includes(`components/${component}/index.js`));
  }
  assert(!evidence.files.some((file) => file.includes('node_modules')));
  const graphViewDeclaration = await readFile(
    join(outputDirectory, 'components/graph-view/GraphView.d.ts'),
    'utf8',
  );
  for (const exportName of [
    'GraphViewController',
    'GraphViewEdge',
    'GraphViewElementEvent',
    'GraphViewFitOptions',
    'GraphViewLayoutName',
    'GraphViewNode',
    'GraphViewStyleRule',
  ]) {
    assert(graphViewDeclaration.includes(exportName), `Missing materialized ${exportName}`);
  }
  const graphViewTypeFile = evidence.files.find((file) =>
    /^components\/graph-view\/GraphView\.types-\d+\.d\.ts$/u.test(file),
  );
  assert(graphViewTypeFile);
  const graphViewTypes = await readFile(join(outputDirectory, graphViewTypeFile), 'utf8');
  assert(graphViewTypes.includes('export interface GraphViewController'));
  assert(!/(?:from\s+|import\s*\()(['"])\.{1,2}\//u.test(graphViewTypes));

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
  const { Reader } = await load('components/reader/index.js');
  for (const target of publicFeatureTargets) {
    const artifact = await load(`components/${target.component}/index.js`);
    assert.notEqual(artifact[target.exportName], undefined, target.exportName);
  }
  assert.equal(typeof AppBar, 'function');
  assert.equal(typeof DatePicker, 'function');
  assert.equal(typeof GraphView, 'function');
  assert.equal(typeof TreeView, 'function');
  assert.equal(typeof Reader, 'function');
  assert.equal(typeof useZoraTheme, 'function');
  const readerArtifact = await readFile(
    join(outputDirectory, 'components/reader/Reader.js'),
    'utf8',
  );
  assert.match(readerArtifact, /from ['"]@ankhorage\/reader['"]/u);
  assert(!readerArtifact.includes('pdf.worker.mjs'));
  await verifyPackedReaderMaterializationAsync(packageRoot);

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

async function verifyPackedReaderMaterializationAsync(packageRoot: string): Promise<void> {
  const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8')) as {
    readonly peerDependencies: Readonly<Record<string, string>>;
  };
  const react = packageJson.peerDependencies.react;
  const reactNative = packageJson.peerDependencies['react-native'];
  const reactNativeWeb = packageJson.peerDependencies['react-native-web'];
  assert(react);
  assert(reactNative);
  assert(reactNativeWeb);
  const sandbox = await mkdtemp(join(tmpdir(), 'zora-packed-web-reader-'));
  const packageDirectory = join(sandbox, 'package');
  const consumerRoot = join(sandbox, 'consumer');
  try {
    await Promise.all([
      mkdir(packageDirectory, { recursive: true }),
      mkdir(consumerRoot, { recursive: true }),
    ]);
    const pack = Bun.spawnSync({
      cmd: ['npm', 'pack', '--silent', '--pack-destination', packageDirectory],
      cwd: packageRoot,
      stderr: 'pipe',
      stdout: 'pipe',
    });
    assert.equal(pack.exitCode, 0, pack.stderr.toString());
    const tarballs = (await readdir(packageDirectory)).filter((file) => file.endsWith('.tgz'));
    assert.deepEqual(tarballs.length, 1);
    const tarball = tarballs[0];
    assert(tarball);
    await writeFile(
      join(consumerRoot, 'package.json'),
      `${JSON.stringify(
        {
          dependencies: {
            '@ankhorage/zora': `file:../package/${tarball}`,
            react,
            'react-dom': react,
            'react-native': reactNative,
            'react-native-web': reactNativeWeb,
          },
          name: 'zora-packed-reader-consumer',
          private: true,
          type: 'module',
        },
        null,
        2,
      )}\n`,
    );
    const install = Bun.spawnSync({
      cmd: ['bun', 'install', '--ignore-scripts'],
      cwd: consumerRoot,
      stderr: 'pipe',
      stdout: 'pipe',
    });
    assert.equal(install.exitCode, 0, install.stderr.toString());
    await writeFile(
      join(consumerRoot, 'materialize.mjs'),
      [
        "import provider from '@ankhorage/zora/cli';",
        "const handler = provider.handlers.find(({ path }) => path.join('/') === 'create')?.handler;",
        "if (handler === undefined) throw new Error('Missing ZORA create handler.');",
        "const result = await handler({ argv: ['reader', '--web'], context: { cwd: process.cwd(), writeStderr(message) { throw new Error(message); }, writeStdout() {} } });",
        "if (result.exitCode !== 0) throw new Error('Could not materialize Reader.');",
        "const sync = provider.handlers.find(({ path }) => path.join('/') === 'sync')?.handler;",
        "if (sync === undefined) throw new Error('Missing ZORA sync handler.');",
        "const synchronized = await sync({ argv: ['--web'], context: { cwd: process.cwd(), writeStderr(message) { throw new Error(message); }, writeStdout() {} } });",
        "if (synchronized.exitCode !== 0) throw new Error('Could not synchronize Reader.');",
        "const artifact = await import('./.ankh/zora/web/components/reader/index.js');",
        "if (typeof artifact.Reader !== 'function') throw new Error('Materialized Reader did not resolve its runtime dependency.');",
        '',
      ].join('\n'),
    );
    const materialize = Bun.spawnSync({
      cmd: [process.execPath, 'materialize.mjs'],
      cwd: consumerRoot,
      stderr: 'pipe',
      stdout: 'pipe',
    });
    assert.equal(materialize.exitCode, 0, materialize.stderr.toString());
  } finally {
    await rm(sandbox, { force: true, recursive: true });
  }
}
