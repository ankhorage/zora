import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync('/tmp/zora-packed-web-consumer-');
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
        },
      },
      null,
      2,
    )}\n`,
  );
}

/*** Exercise SSR, hydration, and an input event using only published ZORA web subpaths. */
function writeConsumerAcceptance(consumerRoot: string): void {
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Window } from 'happy-dom';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { ZoraProvider, useZoraTheme } from '@ankhorage/zora/web/runtime';
import { Button } from '@ankhorage/zora/web/button';
import { Select } from '@ankhorage/zora/web/select';
import { TreeView } from '@ankhorage/zora/web/tree-view';
import { GraphView } from '@ankhorage/zora/web/graph-view';

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
    TMPDIR: '/tmp',
  });
  run(['bun', 'acceptance.mjs'], consumerRoot);
  console.log('Packed ZORA web consumer SSR, hydration, and Select interaction passed.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
