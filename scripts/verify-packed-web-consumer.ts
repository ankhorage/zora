import { strict as assert } from 'node:assert';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-web-consumer-'));
const skipBuild = process.argv.includes('--skip-build');
const authoring = process.argv.includes('--authoring');

/*** Run one consumer-boundary command and retain its output on failure. */
function run(
  command: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {},
): void {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: { ...process.env, CI: '1', ...environment },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${result.stdout.toString()}\n${result.stderr.toString()}`;
  assert.equal(result.exitCode, 0, `${command.join(' ')} failed:\n${output}`);
}

/*** Create an isolated package manifest with only the consumer's declared dependencies. */
function writeConsumerPackage(consumerRoot: string, tarballPath: string): void {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-web-consumer-acceptance',
        private: true,
        type: 'module',
        dependencies: {
          '@ankhorage/zora': `file:${tarballPath}`,
          '@ankhorage/surface': '9.8.2',
          'happy-dom': '21.0.4',
          react: '19.2.3',
          'react-dom': '19.2.3',
          ...(authoring ? { 'react-native-web': '0.21.4', vite: '8.3.8' } : {}),
        },
        devDependencies: {
          '@types/react': '19.3.0',
          typescript: '~6.0.3',
        },
      },
      null,
      2,
    )}\n`,
  );
}

/*** Verify the packed generated declaration graph before skipping third-party declaration bodies. */
function verifyPackedWebDeclarationClosure(consumerRoot: string): void {
  const packageRoot = join(consumerRoot, 'node_modules', '@ankhorage', 'zora');
  const webDistRoot = join(packageRoot, 'web-dist');
  const manifest = JSON.parse(readFileSync(join(webDistRoot, 'manifest.json'), 'utf8')) as {
    readonly artifacts: readonly {
      readonly component: string;
      readonly files: readonly string[];
    }[];
  };
  const declarationFiles = manifest.artifacts.flatMap(({ component, files }) => {
    const artifactRoot = join(webDistRoot, 'components', component);
    const entrypoint = join(artifactRoot, 'index.d.ts');
    assert.ok(existsSync(entrypoint), `Missing packed ZORA declaration entrypoint: ${entrypoint}`);
    return files.filter((file) => file.endsWith('.d.ts')).map((file) => ({ artifactRoot, file }));
  });
  declarationFiles.push({
    artifactRoot: join(webDistRoot, 'runtime'),
    file: 'runtime/ZoraProvider.d.ts',
  });
  declarationFiles.push({
    artifactRoot: webDistRoot,
    file: 'index.d.ts',
  });

  for (const { artifactRoot, file } of declarationFiles) {
    const declarationPath = resolve(webDistRoot, file);
    assert.ok(
      declarationPath.startsWith(`${artifactRoot}/`),
      `ZORA declaration escapes its packed artifact: ${file}`,
    );
    assert.ok(existsSync(declarationPath), `Missing packed ZORA declaration: ${file}`);
    const declaration = readFileSync(declarationPath, 'utf8');
    assert.doesNotMatch(declaration, /from\s+['"]@ankhorage\/zora['"]/u);
    for (const match of declaration.matchAll(
      /(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/gu,
    )) {
      const specifier = match[1];
      assert.notEqual(specifier, undefined);
      const basePath = resolve(artifactRoot, specifier);
      assert.ok(
        basePath.startsWith(`${artifactRoot}/`),
        `ZORA declaration dependency escapes its packed artifact: ${file} -> ${specifier}`,
      );
      assert.ok(
        [
          basePath,
          `${basePath}.d.ts`,
          basePath.replace(/\.js$/u, '.d.ts'),
          join(basePath, 'index.d.ts'),
        ].some(existsSync),
        `Unresolved packed ZORA declaration dependency: ${file} -> ${specifier}`,
      );
    }
  }
}

/*** Exercise SSR, hydration, and an input event using only published ZORA web subpaths. */
function writeAuthoringConsumerAcceptance(consumerRoot: string): void {
  mkdirSync(join(consumerRoot, 'src'));
  writeFileSync(
    join(consumerRoot, 'vite.config.mjs'),
    `import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    conditions: ['browser', 'import', 'default'],
    dedupe: ['react', 'react-dom'],
  },
  ssr: {
    noExternal: ['@ankhorage/surface', '@ankhorage/zora', 'react-native-web'],
    resolve: { conditions: ['browser', 'import', 'default'] },
  },
});
`,
  );
  writeFileSync(
    join(consumerRoot, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/authoring.tsx"></script></body></html>\n',
  );
  writeFileSync(
    join(consumerRoot, 'src', 'authoring.tsx'),
    `import React from 'react';
import {
  AuthoringSelectionAdapter,
  AuthoringBindingEditorAdapter,
  AuthoringPropertyInspectorAdapter,
  Button,
  Card,
  Field,
  Pressable,
  Text,
  TextInput,
  ThemeEditorAdapter,
  ThemeProvider,
  View,
  useTheme,
} from '@ankhorage/zora/authoring';

const screens = [
  { id: 'first', label: 'First screen' },
  { id: 'second', label: 'Second screen' },
];

export function App() {
  const [selectedScreenId, setSelectedScreenId] = React.useState('first');
  const [selectionNotifications, setSelectionNotifications] = React.useState(0);
  const [containerSelectedScreenId, setContainerSelectedScreenId] = React.useState('first');
  const [containerSelectionNotifications, setContainerSelectionNotifications] = React.useState(0);
  const [disabledSelectionNotifications, setDisabledSelectionNotifications] = React.useState(0);
  const [name, setName] = React.useState('');
  return (
    <ThemeProvider>
      <View gap="m">
        <Text>Authoring controls</Text>
        <Field helperText="Required before creation" label="Screen name">
          <TextInput onChangeText={setName} testID="authoring-name" value={name} />
        </Field>
        <Card>
          <Button disabled={name.length === 0} testID="authoring-create">
            Create screen
          </Button>
        </Card>
        <Pressable testID="authoring-pressable">
          <Text>Pressable authoring control</Text>
        </Pressable>
        <AuthoringSelectionAdapter
          getItemId={(screen) => screen.id}
          items={screens}
          onSelectionChange={(screen) => {
            setSelectedScreenId(screen?.id ?? '');
            setSelectionNotifications((count) => count + 1);
          }}
          renderItem={({ item, selected, disabled, select }) => (
            <Button disabled={disabled} onPress={select} testID={\`authoring-select-\${item.id}\`}>
              {selected ? \`Selected \${item.label}\` : item.label}
            </Button>
          )}
          selectedItemId={selectedScreenId}
        />
        <Text testID="authoring-explicit-selection-notifications">
          {selectionNotifications}
        </Text>
        <AuthoringSelectionAdapter
          getItemId={(screen) => screen.id}
          items={screens}
          onSelectionChange={(screen) => {
            setContainerSelectedScreenId(screen?.id ?? '');
            setContainerSelectionNotifications((count) => count + 1);
          }}
          renderItem={({ item, selected }) => (
            <View testID={\`authoring-container-\${item.id}\`}>
              <Text>{selected ? \`Selected container \${item.label}\` : item.label}</Text>
            </View>
          )}
          selectedItemId={containerSelectedScreenId}
        />
        <Text testID="authoring-container-selection-notifications">
          {containerSelectionNotifications}
        </Text>
        <AuthoringSelectionAdapter
          disabled
          getItemId={(screen) => screen.id}
          items={[screens[0]]}
          onSelectionChange={() => setDisabledSelectionNotifications((count) => count + 1)}
          renderItem={({ item, disabled, select }) => (
            <Button disabled={disabled} onPress={select} testID="authoring-disabled">
              {item.label}
            </Button>
          )}
        />
        <Text testID="authoring-disabled-selection-notifications">
          {disabledSelectionNotifications}
        </Text>
        <AuthoringBindingEditorAdapter
          component={{ bindings: { props: {} } }}
          getBinding={() => undefined}
          node={{}}
          renderBinding={() => null}
        />
        <AuthoringPropertyInspectorAdapter
          component={{ props: {} }}
          getPropertyValue={() => undefined}
          node={{}}
          renderProperty={() => null}
        />
        <ThemeEditorAdapter
          getRecipeFieldValue={() => undefined}
          recipes={{}}
          renderField={() => null}
          theme={{}}
        />
      </View>
    </ThemeProvider>
  );
}

export const authoringApi = {
  AuthoringBindingEditorAdapter,
  AuthoringPropertyInspectorAdapter,
  AuthoringSelectionAdapter,
  Button,
  Card,
  Field,
  Pressable,
  Text,
  TextInput,
  ThemeEditorAdapter,
  ThemeProvider,
  View,
  useTheme,
};

`,
  );
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Window } from 'happy-dom';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const browser = new Window();
Object.assign(globalThis, {
  window: browser,
  document: browser.document,
  navigator: browser.navigator,
  HTMLElement: browser.HTMLElement,
  Node: browser.Node,
  Element: browser.Element,
  MutationObserver: browser.MutationObserver,
  ShadowRoot: browser.ShadowRoot,
  getComputedStyle: browser.getComputedStyle.bind(browser),
  requestAnimationFrame: browser.requestAnimationFrame.bind(browser),
  cancelAnimationFrame: browser.cancelAnimationFrame.bind(browser),
  IS_REACT_ACT_ENVIRONMENT: true,
});

assert.equal(existsSync(join(process.cwd(), 'node_modules', '@ankhorage', 'zora', 'node_modules', 'react')), false);
assert.equal(
  JSON.parse(readFileSync(join(process.cwd(), 'node_modules', 'react-native-web', 'package.json'), 'utf8')).version,
  '0.21.4',
);
const vite = await createServer({ configFile: 'vite.config.mjs', server: { middlewareMode: true } });
try {
  const { App, authoringApi } = await vite.ssrLoadModule('/src/authoring.tsx');
  for (const name of [
    'AuthoringBindingEditorAdapter',
    'AuthoringPropertyInspectorAdapter',
    'AuthoringSelectionAdapter',
    'Button',
    'Card',
    'Field',
    'Pressable',
    'Text',
    'TextInput',
    'ThemeEditorAdapter',
    'ThemeProvider',
    'View',
  ]) assert.equal(typeof authoringApi[name], 'function');
  const authoringDirectory = join(process.cwd(), 'node_modules', '@ankhorage', 'zora', 'web-dist', 'authoring');
  const declaration = readFileSync(join(authoringDirectory, 'index.d.ts'), 'utf8');
  for (const name of ['FieldProps', 'PressableProps', 'ThemeEditorAdapterProps']) assert.match(declaration, new RegExp(name));
  const artifact = readFileSync(join(authoringDirectory, 'index.js'), 'utf8');
  for (const forbidden of ['AppBar', 'react-native-safe-area-context', 'react-native-gesture-handler', 'codegen']) assert.equal(artifact.includes(forbidden), false);
  const app = React.createElement(App);
  const markup = renderToString(app);
  assert.match(markup, /Authoring controls/);
  browser.document.body.innerHTML = '<div id="root">' + markup + '</div>';
  let root;
  await React.act(async () => {
    root = hydrateRoot(browser.document.getElementById('root'), app);
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  const secondScreen = browser.document.querySelector('[data-testid="authoring-select-second"]');
  assert.notEqual(secondScreen, null);
  await React.act(async () => {
    secondScreen.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  assert.match(secondScreen.textContent ?? '', /Selected Second screen/);
  assert.equal(
    browser.document.querySelector('[data-testid="authoring-explicit-selection-notifications"]')?.textContent,
    '1',
  );
  const secondContainer = browser.document.querySelector('[data-testid="authoring-container-second"]');
  assert.notEqual(secondContainer, null);
  await React.act(async () => {
    secondContainer.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  assert.match(secondContainer.textContent ?? '', /Selected container Second screen/);
  assert.equal(
    browser.document.querySelector('[data-testid="authoring-container-selection-notifications"]')?.textContent,
    '1',
  );
  assert.equal(browser.document.querySelector('[data-testid="authoring-create"]')?.hasAttribute('disabled'), true);
  assert.equal(browser.document.querySelector('[data-testid="authoring-disabled"]')?.hasAttribute('disabled'), true);
  await React.act(async () => {
    browser.document.querySelector('[data-testid="authoring-disabled"]')?.dispatchEvent(
      new browser.MouseEvent('click', { bubbles: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  assert.equal(
    browser.document.querySelector('[data-testid="authoring-disabled-selection-notifications"]')?.textContent,
    '0',
  );
  root.unmount();
} finally {
  await vite.close();
}
console.log('Packed ZORA authoring consumer Vite/RNW render and controlled selection passed.');
`,
  );
}

/*** Exercise the established public web API through SSR, hydration, and Select interaction. */
function writeWebConsumerAcceptance(consumerRoot: string): void {
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Window } from 'happy-dom';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import {
  ActivityIndicator,
  GraphView,
  TreeView,
  ZoraProvider,
  useZoraTheme,
} from '@ankhorage/zora/web';
import { Button } from '@ankhorage/zora/web/button';
import { Select } from '@ankhorage/zora/web/select';

const browser = new Window();
Object.assign(globalThis, {
  window: browser,
  document: browser.document,
  navigator: browser.navigator,
  HTMLElement: browser.HTMLElement,
  Node: browser.Node,
  Element: browser.Element,
  MutationObserver: browser.MutationObserver,
  getComputedStyle: browser.getComputedStyle.bind(browser),
  requestAnimationFrame: browser.requestAnimationFrame.bind(browser),
  cancelAnimationFrame: browser.cancelAnimationFrame.bind(browser),
  IS_REACT_ACT_ENVIRONMENT: true,
});

assert.equal(existsSync(join(process.cwd(), 'node_modules', '@ankhorage', 'zora', 'node_modules', 'react')), false);
assert.equal(typeof GraphView, 'function');
const canonicalGraphView = React.createElement(GraphView, {
  graph: {
    nodes: [{ id: 1, labels: ['Package'], data: { name: 'zora' } }],
    edges: [],
  },
});
assert.equal(canonicalGraphView.props.graph.nodes[0].id, 1);

function ThemeProbe() {
  const { mode } = useZoraTheme();
  return React.createElement('span', { 'data-testid': 'theme-probe', 'data-mode': mode }, mode);
}

function App() {
  const [value, setValue] = React.useState('grid');
  return React.createElement(
    ZoraProvider,
    { mode: 'light' },
    React.createElement(ThemeProbe),
    React.createElement(ActivityIndicator, { size: 'small', testID: 'activity-indicator' }),
    React.createElement(Button, null, 'Save'),
    React.createElement(Select, {
      value,
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Circle', value: 'circle' },
      ],
      onValueChange: setValue,
      testID: 'layout',
    }),
    React.createElement(TreeView, {
      defaultExpandedIds: ['root'],
      nodes: [{ id: 'root', label: 'Root', children: [{ id: 'child', label: 'Child' }] }],
    }),
  );
}

const app = React.createElement(App);
const markup = renderToString(app);
assert.match(markup, /Save/);
assert.match(markup, /Root/);
assert.match(markup, /data-testid="activity-indicator"/);
assert.match(markup, /height:20px/);
assert.match(markup, /width:20px/);
assert.doesNotMatch(markup, /r-width-/);
browser.document.body.innerHTML = '<div id="root">' + markup + '</div>';
const hydrationErrors = [];
const originalError = console.error;
console.error = (...args) => {
  const message = args.map(String).join(' ');
  if (/hydration/i.test(message)) hydrationErrors.push(message);
  originalError(...args);
};
try {
  let root;
  await React.act(async () => {
    root = hydrateRoot(browser.document.getElementById('root'), app);
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  assert.deepEqual(hydrationErrors, []);
  const indicator = browser.document.querySelector('[data-testid="activity-indicator"]');
  assert.notEqual(indicator, null);
  assert.equal(indicator?.getAttribute('role'), 'progressbar');
  assert.match(indicator?.getAttribute('style') ?? '', /height:20px/);
  assert.match(indicator?.getAttribute('style') ?? '', /width:20px/);
  assert.equal(browser.document.querySelector('[data-testid="theme-probe"]')?.getAttribute('data-mode'), 'light');
  await React.act(async () => {
    browser.document.querySelector('[data-testid="layout-trigger"]')?.dispatchEvent(
      new browser.MouseEvent('click', { bubbles: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  const option = browser.document.querySelector('[data-testid="layout-option-circle"]');
  assert.notEqual(option, null);
  await React.act(async () => {
    option.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
  assert.match(browser.document.querySelector('[data-testid="layout-trigger"]')?.textContent ?? '', /Circle/);
  root.unmount();
} finally {
  console.error = originalError;
}
console.log('Packed ZORA web consumer SSR, hydration, and Select interaction passed.');
`,
  );
}

/*** Compile the packed browser declaration contracts without a native consumer dependency graph. */
function writeWebTypeConsumerAcceptance(consumerRoot: string): void {
  writeFileSync(
    join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          target: 'ES2022',
          types: ['react'],
        },
        include: ['web-contract.ts'],
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'web-contract.ts'),
    `import {
  GraphView,
  type GraphViewCanonicalEdgeData,
  type GraphViewCanonicalGraphProps,
  type GraphViewCanonicalNodeData,
  type GraphViewController,
  type GraphViewEdge,
  type GraphViewFitOptions,
  type GraphViewInput,
  type GraphViewLayoutName,
  type GraphViewProps,
  type GraphViewViewport,
  type ResolvedGraphViewProps,
} from '@ankhorage/zora/web/graph-view';
import { GraphView as WebGraphView } from '@ankhorage/zora/web';

const graphProps: GraphViewProps = {
  ariaLabel: 'Dependency graph',
  edges: [],
  layout: 'grid',
  nodes: [{ id: 'root' }],
  onNodeEvent: () => undefined,
  topologyUpdatePolicy: 'preserve-positions',
};
const canonicalGraphProps: GraphViewCanonicalGraphProps = {
  ariaLabel: 'Canonical dependency graph',
  graph: { edges: [], nodes: [] },
  layout: 'circle',
};
const graphEvents: 'zora-graph-view-ready' = GraphView.events.ready;
const webGraphView: typeof GraphView = WebGraphView;
const props = {} as {
  graphController: GraphViewController;
  graphCanonicalEdge: GraphViewCanonicalEdgeData;
  graphCanonicalGraph: GraphViewCanonicalGraphProps;
  graphCanonicalNode: GraphViewCanonicalNodeData;
  graphEdge: GraphViewEdge;
  graphFitOptions: GraphViewFitOptions;
  graphInput: GraphViewInput;
  graphLayoutName: GraphViewLayoutName;
  graphResolved: ResolvedGraphViewProps;
  graphViewport: GraphViewViewport;
  graph: GraphViewProps;
};

void canonicalGraphProps;
void graphEvents;
void graphProps;
void webGraphView;
void props;
`,
  );
}

try {
  const packageDirectory = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  if (!skipBuild) run(['bun', 'run', 'build'], repositoryRoot);
  mkdirSync(packageDirectory);
  run(
    ['npm', 'pack', '--ignore-scripts', '--silent', '--pack-destination', packageDirectory],
    repositoryRoot,
    { npm_config_cache: join(temporaryRoot, 'npm-cache') },
  );
  const tarballs = readdirSync(packageDirectory).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one packed ZORA tarball.');
  const [tarball] = tarballs;
  assert.notEqual(tarball, undefined, 'Expected a packed ZORA tarball.');
  mkdirSync(consumerRoot);
  writeConsumerPackage(consumerRoot, join(packageDirectory, tarball));
  if (authoring) writeAuthoringConsumerAcceptance(consumerRoot);
  else {
    writeWebConsumerAcceptance(consumerRoot);
    writeWebTypeConsumerAcceptance(consumerRoot);
  }
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  run(['bun', 'acceptance.mjs'], consumerRoot);
  if (!authoring) {
    verifyPackedWebDeclarationClosure(consumerRoot);
    run(['bunx', 'tsc', '--noEmit'], consumerRoot);
  }
  if (authoring) {
    run(['bunx', 'vite', 'build'], consumerRoot);
    console.log('Packed ZORA authoring consumer Vite/RNW render and controlled selection passed.');
  } else {
    console.log('Packed ZORA web consumer SSR, hydration, and Select interaction passed.');
  }
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
