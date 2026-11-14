import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-web-consumer-'));
const skipBuild = process.argv.includes('--skip-build');

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
          'happy-dom': '21.0.4',
          react: '19.2.3',
          'react-dom': '19.2.3',
          'react-native-web': '0.21.3',
          vite: '8.3.8',
        },
      },
      null,
      2,
    )}\n`,
  );
}

/*** Exercise SSR, hydration, and an input event using only published ZORA web subpaths. */
function writeConsumerAcceptance(consumerRoot: string): void {
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
  Button,
  Card,
  Text,
  TextInput,
  ThemeProvider,
  View,
} from '@ankhorage/zora/authoring';

const screens = [
  { id: 'first', label: 'First screen' },
  { id: 'second', label: 'Second screen' },
];

export function App() {
  const [selectedScreenId, setSelectedScreenId] = React.useState('first');
  const [name, setName] = React.useState('');
  return (
    <ThemeProvider>
      <View gap="m">
        <Text>Authoring controls</Text>
        <TextInput onChangeText={setName} testID="authoring-name" value={name} />
        <Card title="Create screen">
          <Button disabled={name.length === 0} testID="authoring-create">
            Create screen
          </Button>
        </Card>
        <AuthoringSelectionAdapter
          getItemId={(screen) => screen.id}
          items={screens}
          onSelectionChange={(screen) => setSelectedScreenId(screen?.id ?? '')}
          renderItem={({ item, selected, disabled, select }) => (
            <Button disabled={disabled} onPress={select} testID={\`authoring-select-\${item.id}\`}>
              {selected ? \`Selected \${item.label}\` : item.label}
            </Button>
          )}
          selectedItemId={selectedScreenId}
        />
      </View>
    </ThemeProvider>
  );
}
`,
  );
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
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
const vite = await createServer({ configFile: 'vite.config.mjs', server: { middlewareMode: true } });
try {
  const { App } = await vite.ssrLoadModule('/src/authoring.tsx');
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
  assert.equal(browser.document.querySelector('[data-testid="authoring-create"]')?.hasAttribute('disabled'), true);
  root.unmount();
} finally {
  await vite.close();
}
console.log('Packed ZORA authoring consumer Vite/RNW render and controlled selection passed.');
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
  writeConsumerAcceptance(consumerRoot);
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  run(['bun', 'acceptance.mjs'], consumerRoot);
  run(['bunx', 'vite', 'build'], consumerRoot);
  console.log('Packed ZORA authoring consumer Vite/RNW render and controlled selection passed.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
