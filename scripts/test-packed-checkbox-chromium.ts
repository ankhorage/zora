import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

type JsonRecord = Record<string, unknown>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-checkbox-chromium-'));
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

/*** Verify the packed public Checkbox entrypoint in Chromium with native browser input. */
async function testPackedCheckboxChromiumAsync() {
  const packageRoot = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  mkdirSync(packageRoot);
  mkdirSync(consumerRoot);
  run(['bun', 'run', 'build'], repositoryRoot);
  const tarballPath = packZora(packageRoot);
  writeConsumerPackage(consumerRoot, tarballPath);
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  writeAcceptanceSources(consumerRoot);
  const markup = {
    dark: runAndRead(['bun', 'server.mjs', 'dark'], consumerRoot),
    light: runAndRead(['bun', 'server.mjs', 'light'], consumerRoot),
  };
  const bundle = await Bun.build({
    entrypoints: [join(consumerRoot, 'client.tsx')],
    format: 'esm',
    naming: 'checkbox.js',
    outdir: consumerRoot,
    target: 'browser',
  });
  assert(bundle.success, bundle.logs.map(({ message }) => message).join('\n'));
  const server = Bun.serve({
    fetch(request) {
      return new URL(request.url).pathname === '/checkbox.js'
        ? new Response(Bun.file(join(consumerRoot, 'checkbox.js')))
        : new Response(
            `<!doctype html><html><body><div id="root">${markup[new URL(request.url).searchParams.get('mode') === 'dark' ? 'dark' : 'light']}</div><script type="module" src="/checkbox.js"></script></body></html>`,
            { headers: { 'content-type': 'text/html; charset=utf-8' } },
          );
    },
    port: 0,
  });
  const serverUrl = `http://127.0.0.1:${server.port}`;
  try {
    for (const mode of ['light', 'dark'] as const) {
      const preHydrationBrowser = await ChromeSession.createAsync(await dynamicPortAsync());
      try {
        await preHydrationBrowser.disableScriptExecutionAsync();
        await preHydrationBrowser.navigateAsync(`${serverUrl}?mode=${mode}`);
        await preHydrationBrowser.assertPreHydrationCheckboxesAsync(mode);
      } finally {
        preHydrationBrowser.close();
      }
    }

    const browser = await ChromeSession.createAsync(await dynamicPortAsync());
    try {
      await browser.navigateAsync(serverUrl);
      const initial = await browser.waitForStateAsync((state) => state.hydrated === true);
      assert.equal(initial.hydrationErrors.length, 0, initial.hydrationErrors.join('\n'));
      assert.equal(initial.ariaChecked, 'false');
      assert.equal(initial.mode, 'light');
      assert.equal(initial.disabledChecked, 'true');
      assert.equal(initial.readOnlyChecked, 'true');
      assert.equal(await browser.axCheckedAsync('Packed checkbox'), 'false');

      await browser.clickTestIdAsync('packed-checkbox');
      const clicked = await browser.waitForStateAsync((state) => state.ariaChecked === 'true');
      assert.equal(clicked.changeCount, 1);
      assert.equal(await browser.axCheckedAsync('Packed checkbox'), 'true');

      await browser.focusAndPressSpaceAsync('packed-checkbox');
      const spaced = await browser.waitForStateAsync((state) => state.ariaChecked === 'false');
      assert.equal(spaced.changeCount, 2);
      assert.equal(await browser.axCheckedAsync('Packed checkbox'), 'false');

      await browser.clickTestIdAsync('programmatic-reset');
      const reset = await browser.waitForStateAsync((state) => state.ariaChecked === 'false');
      assert.equal(reset.changeCount, 2);

      await browser.clickTestIdAsync('toggle-theme');
      const dark = await browser.waitForStateAsync((state) => state.mode === 'dark');
      assert.equal(dark.mode, 'dark');

      for (const testId of ['disabled-checkbox', 'readonly-checkbox']) {
        await browser.clickTestIdAsync(testId);
        await browser.focusAndPressSpaceAsync(testId);
      }
      const protectedState = await browser.waitForStateAsync(
        (state) => state.disabledChecked === 'true' && state.readOnlyChecked === 'true',
      );
      assert.equal(protectedState.changeCount, 2);
      assert.equal(browser.exceptions.length, 0, browser.exceptions.join('\n'));
      assert.equal(browser.consoleErrors.length, 0, browser.consoleErrors.join('\n'));
      console.log(
        'Packed ZORA Checkbox Chromium acceptance passed: JavaScript-disabled pre-hydration Light/Dark DOM/AX, SSR/hydration, controlled click/Space/reset, ARIA/AX, disabled, and readOnly.',
      );
    } finally {
      browser.close();
    }
  } finally {
    server.stop();
  }
}

/*** Run one isolated process and retain output when it fails. */
function run(
  command: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {},
) {
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

/*** Run one isolated process and return its standard output. */
function runAndRead(command: readonly string[], cwd: string): string {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: { ...process.env, CI: '1' },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${result.stdout.toString()}\n${result.stderr.toString()}`;
  assert.equal(result.exitCode, 0, `${command.join(' ')} failed:\n${output}`);
  return result.stdout.toString();
}

/*** Package only the built ZORA candidate for an independent consumer installation. */
function packZora(packageRoot: string): string {
  run(
    ['npm', 'pack', '--ignore-scripts', '--silent', '--pack-destination', packageRoot],
    repositoryRoot,
    { npm_config_cache: join(temporaryRoot, 'npm-cache') },
  );
  const tarballs = readdirSync(packageRoot).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one packed ZORA tarball.');
  return join(packageRoot, tarballs[0] as string);
}

/*** Declare the independent public-package consumer graph. */
function writeConsumerPackage(consumerRoot: string, tarballPath: string) {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-checkbox-chromium-acceptance',
        private: true,
        type: 'module',
        dependencies: {
          '@ankhorage/zora': `file:${tarballPath}`,
          '@ankhorage/surface': '^9.5.15',
          react: '19.2.3',
          'react-dom': '19.2.3',
        },
      },
      null,
      2,
    )}\n`,
  );
}

/*** Materialize matching server and browser entries that use only the public Checkbox subpath. */
function writeAcceptanceSources(consumerRoot: string) {
  const appSource = `import React from 'react';
import { Checkbox } from '@ankhorage/zora/web/checkbox';
import { ZoraProvider, useZoraTheme } from '@ankhorage/zora/web/runtime';

function ThemeProbe() {
  const { mode } = useZoraTheme();
  return <output data-testid="theme-mode">{mode}</output>;
}

export function App({ initialMode = 'light' }) {
  const [checked, setChecked] = React.useState(false);
  const [changes, setChanges] = React.useState(0);
  const [mode, setMode] = React.useState(initialMode);
  return <ZoraProvider mode={mode}>
    <ThemeProbe />
    <Checkbox accessibilityLabel="Packed checkbox" checked={checked} onCheckedChange={(next) => { setChecked(next); setChanges((count) => count + 1); }} testID="packed-checkbox">Packed checkbox</Checkbox>
    <output data-testid="change-count">{changes}</output>
    <button data-testid="programmatic-reset" onClick={() => setChecked(false)}>Reset</button>
    <button data-testid="toggle-theme" onClick={() => setMode((current) => current === 'light' ? 'dark' : 'light')}>Theme</button>
    <Checkbox accessibilityLabel="Disabled checkbox" defaultChecked disabled testID="disabled-checkbox">Disabled checkbox</Checkbox>
    <Checkbox accessibilityLabel="Read only checkbox" defaultChecked readOnly testID="readonly-checkbox">Read only checkbox</Checkbox>
  </ZoraProvider>;
}
`;
  writeFileSync(join(consumerRoot, 'App.tsx'), appSource);
  writeFileSync(
    join(consumerRoot, 'server.mjs'),
    `import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.tsx';
const mode = process.argv[2] === 'dark' ? 'dark' : 'light';
process.stdout.write(renderToString(React.createElement(App, { initialMode: mode })));
`,
  );
  writeFileSync(
    join(consumerRoot, 'client.tsx'),
    `import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './App.tsx';
const hydrationErrors = [];
hydrateRoot(document.getElementById('root'), React.createElement(App), { onRecoverableError(error) { hydrationErrors.push(String(error)); } });
window.checkboxAcceptance = { read: () => ({
  ariaChecked: document.querySelector('[data-testid="packed-checkbox"]')?.getAttribute('aria-checked'),
  changeCount: Number(document.querySelector('[data-testid="change-count"]')?.textContent),
  disabledChecked: document.querySelector('[data-testid="disabled-checkbox"]')?.getAttribute('aria-checked'),
  hydrated: true,
  hydrationErrors,
  mode: document.querySelector('[data-testid="theme-mode"]')?.textContent,
  readOnlyChecked: document.querySelector('[data-testid="readonly-checkbox"]')?.getAttribute('aria-checked'),
}) };
`,
  );
}

interface CheckboxState {
  readonly ariaChecked: string | null;
  readonly changeCount: number;
  readonly disabledChecked: string | null;
  readonly hydrated: boolean;
  readonly hydrationErrors: readonly string[];
  readonly mode: string | null;
  readonly readOnlyChecked: string | null;
}

interface ElementRect {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

interface AxCheckbox {
  readonly checked: string | undefined;
  readonly disabled: boolean | undefined;
  readonly name: string | undefined;
  readonly readOnly: boolean | undefined;
  readonly role: string | undefined;
}

/*** Reserve a dynamic loopback debugging port for Chromium. */
async function dynamicPortAsync(): Promise<number> {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
}

/*** Drive Chromium exclusively through the public DevTools Protocol. */
class ChromeSession {
  readonly consoleErrors: string[] = [];
  readonly exceptions: string[] = [];
  private nextId = 1;
  private readonly pending = new Map<
    number,
    { reject(error: Error): void; resolve(value: unknown): void }
  >();

  private constructor(
    private readonly process: ReturnType<typeof Bun.spawn>,
    private readonly socket: WebSocket,
  ) {
    socket.onmessage = (event) => this.handleMessage(event.data);
  }

  static async createAsync(debugPort: number): Promise<ChromeSession> {
    const process = Bun.spawn(
      [
        chromiumCommand,
        '--headless=new',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-address=127.0.0.1',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${join(temporaryRoot, `chrome-${debugPort}`)}`,
        'about:blank',
      ],
      { stderr: 'pipe', stdout: 'pipe' },
    );
    try {
      await waitForAsync(`http://127.0.0.1:${debugPort}/json/version`);
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, {
        method: 'PUT',
      });
      const target = (await response.json()) as { readonly webSocketDebuggerUrl?: unknown };
      assert(
        response.ok && typeof target.webSocketDebuggerUrl === 'string',
        'Chrome page creation failed.',
      );
      const socket = new WebSocket(target.webSocketDebuggerUrl);
      await new Promise<void>((resolve, reject) => {
        socket.onopen = () => resolve();
        socket.onerror = () => reject(new Error('Chrome DevTools socket failed to open.'));
      });
      const session = new ChromeSession(process, socket);
      await Promise.all(
        ['Accessibility.enable', 'DOM.enable', 'Log.enable', 'Page.enable', 'Runtime.enable'].map(
          (method) => session.sendAsync(method),
        ),
      );
      return session;
    } catch (error) {
      process.kill();
      throw error;
    }
  }

  async axCheckedAsync(name: string): Promise<string | undefined> {
    return (await this.axCheckboxAsync(name)).checked;
  }

  async assertPreHydrationCheckboxesAsync(mode: 'dark' | 'light'): Promise<void> {
    const expected = [
      {
        attributes: { 'aria-checked': 'false', role: 'checkbox' },
        name: 'Packed checkbox',
        testId: 'packed-checkbox',
      },
      {
        attributes: { 'aria-checked': 'true', 'aria-disabled': 'true', role: 'checkbox' },
        name: 'Disabled checkbox',
        testId: 'disabled-checkbox',
      },
      {
        attributes: { 'aria-checked': 'true', 'aria-readonly': 'true', role: 'checkbox' },
        name: 'Read only checkbox',
        testId: 'readonly-checkbox',
      },
    ] as const;
    for (const checkbox of expected) {
      const attributes = await this.visibleAttributesForTestIdAsync(checkbox.testId);
      for (const [name, value] of Object.entries(checkbox.attributes))
        assert.equal(attributes[name], value, `${mode} pre-hydration ${checkbox.testId} ${name}`);
      const ax = await this.axCheckboxAsync(checkbox.name);
      assert.equal(ax.name, checkbox.name, `${mode} pre-hydration accessible name`);
      assert.equal(ax.role, 'checkbox', `${mode} pre-hydration accessibility role`);
      assert.equal(
        ax.checked,
        checkbox.attributes['aria-checked'],
        `${mode} pre-hydration AX checked`,
      );
      if (checkbox.testId === 'disabled-checkbox')
        assert.equal(ax.disabled, true, `${mode} pre-hydration AX disabled`);
      if (checkbox.testId === 'readonly-checkbox')
        assert.equal(ax.readOnly, true, `${mode} pre-hydration AX readOnly`);
    }
    const modeHtml = await this.outerHtmlForTestIdAsync('theme-mode');
    assert(modeHtml.includes(`>${mode}<`), `Missing ${mode} pre-hydration HTML response state.`);
  }

  async disableScriptExecutionAsync(): Promise<void> {
    await this.sendAsync('Emulation.setScriptExecutionDisabled', { value: true });
  }

  async axCheckboxAsync(name: string): Promise<AxCheckbox> {
    const tree = await this.sendAsync('Accessibility.getFullAXTree');
    assert(isRecord(tree) && Array.isArray(tree.nodes), 'Chrome returned no accessibility tree.');
    const node = tree.nodes.find(
      (candidate) => isRecord(candidate) && readAxName(candidate) === name,
    );
    assert(node !== undefined && isRecord(node), `Missing AX node named ${name}.`);
    return {
      checked: readAxStringProperty(node, 'checked'),
      disabled: readAxBooleanProperty(node, 'disabled'),
      name: readAxName(node),
      readOnly: readAxBooleanProperty(node, 'readonly'),
      role:
        isRecord(node.role) && typeof node.role.value === 'string' ? node.role.value : undefined,
    };
  }

  async clickTestIdAsync(testId: string): Promise<void> {
    const rect = await this.evaluateAsync<ElementRect | null>(
      `(() => { const rect = document.querySelector('[data-testid="${testId}"]')?.getBoundingClientRect(); return rect === undefined ? null : { height: rect.height, width: rect.width, x: rect.x, y: rect.y }; })()`,
    );
    assert(
      rect !== null && rect.width > 0 && rect.height > 0,
      `Missing clickable rectangle for ${testId}.`,
    );
    for (const type of ['mousePressed', 'mouseReleased'] as const) {
      await this.sendAsync('Input.dispatchMouseEvent', {
        button: 'left',
        clickCount: 1,
        type,
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      });
    }
  }

  async focusAndPressSpaceAsync(testId: string): Promise<void> {
    await this.evaluateAsync(`document.querySelector('[data-testid="${testId}"]')?.focus(); true`);
    await this.sendAsync('Input.dispatchKeyEvent', {
      code: 'Space',
      key: ' ',
      type: 'keyDown',
      windowsVirtualKeyCode: 32,
    });
    await this.sendAsync('Input.dispatchKeyEvent', {
      code: 'Space',
      key: ' ',
      type: 'keyUp',
      windowsVirtualKeyCode: 32,
    });
  }

  async navigateAsync(url: string): Promise<void> {
    await this.sendAsync('Page.navigate', { url });
  }

  private async visibleAttributesForTestIdAsync(testId: string): Promise<Record<string, string>> {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      try {
        const document = await this.sendAsync('DOM.getDocument', { depth: 0 });
        assert(isRecord(document) && isRecord(document.root), 'Chrome returned no DOM document.');
        const rootNodeId = document.root.nodeId;
        assert(typeof rootNodeId === 'number', 'Chrome returned no DOM root node id.');
        const result = await this.sendAsync('DOM.querySelector', {
          nodeId: rootNodeId,
          selector: `[data-testid="${testId}"]`,
        });
        assert(
          isRecord(result) && typeof result.nodeId === 'number',
          'Chrome returned no DOM node id.',
        );
        if (result.nodeId === 0) {
          await Bun.sleep(25);
          continue;
        }
        const [attributes, boxModel] = await Promise.all([
          this.sendAsync('DOM.getAttributes', { nodeId: result.nodeId }),
          this.sendAsync('DOM.getBoxModel', { nodeId: result.nodeId }),
        ]);
        assert(isRecord(attributes), 'Chrome returned no attributes.');
        const attributeValues = attributes.attributes;
        assert(Array.isArray(attributeValues), 'Chrome returned invalid attributes.');
        assert(
          isRecord(boxModel) && isRecord(boxModel.model),
          'Chrome returned no element box model.',
        );
        const width = boxModel.model.width;
        const height = boxModel.model.height;
        assert(
          typeof width === 'number' && width > 0 && typeof height === 'number' && height > 0,
          `Pre-hydration ${testId} is not visible.`,
        );
        return Object.fromEntries(
          Array.from({ length: attributeValues.length / 2 }, (_, index) => [
            String(attributeValues[index * 2]),
            String(attributeValues[index * 2 + 1]),
          ]),
        );
      } catch (error) {
        if (Date.now() >= deadline) throw error;
        await Bun.sleep(25);
      }
    }
    throw new Error(`Timed out waiting for pre-hydration ${testId}.`);
  }

  private async outerHtmlForTestIdAsync(testId: string): Promise<string> {
    const document = await this.sendAsync('DOM.getDocument', { depth: 0 });
    assert(isRecord(document) && isRecord(document.root), 'Chrome returned no DOM document.');
    const rootNodeId = document.root.nodeId;
    assert(typeof rootNodeId === 'number', 'Chrome returned no DOM root node id.');
    const result = await this.sendAsync('DOM.querySelector', {
      nodeId: rootNodeId,
      selector: `[data-testid="${testId}"]`,
    });
    assert(isRecord(result) && typeof result.nodeId === 'number' && result.nodeId !== 0);
    const outerHtml = await this.sendAsync('DOM.getOuterHTML', { nodeId: result.nodeId });
    assert(isRecord(outerHtml) && typeof outerHtml.outerHTML === 'string');
    return outerHtml.outerHTML;
  }

  async waitForStateAsync(predicate: (state: CheckboxState) => boolean): Promise<CheckboxState> {
    const deadline = Date.now() + 30_000;
    let last: CheckboxState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<CheckboxState | null>(
        'window.checkboxAcceptance?.read() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.evaluateAsync('new Promise((resolve) => requestAnimationFrame(resolve))');
    }
    throw new Error(`Timed out waiting for checkbox state: ${JSON.stringify(last)}`);
  }

  close(): void {
    this.socket.close();
    this.process.kill();
  }

  private async evaluateAsync<T>(expression: string): Promise<T> {
    const result = await this.sendAsync('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    });
    assert(
      isRecord(result) && isRecord(result.result) && 'value' in result.result,
      `Chrome returned no value for ${expression}.`,
    );
    return result.result.value as T;
  }

  private handleMessage(data: unknown): void {
    const source =
      typeof data === 'string'
        ? data
        : data instanceof ArrayBuffer
          ? Buffer.from(data).toString()
          : '';
    if (!source) return;
    const message = JSON.parse(source) as JsonRecord;
    if (typeof message.id === 'number') {
      const pending = this.pending.get(message.id);
      if (pending === undefined) return;
      this.pending.delete(message.id);
      if ('error' in message) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    const params = isRecord(message.params) ? message.params : {};
    if (message.method === 'Runtime.exceptionThrown')
      this.exceptions.push(JSON.stringify(params.exceptionDetails));
    if (
      message.method === 'Log.entryAdded' &&
      isRecord(params.entry) &&
      params.entry.level === 'error'
    )
      this.consoleErrors.push(String(params.entry.text ?? 'unknown Log error'));
  }

  private sendAsync(method: string, params?: JsonRecord): Promise<unknown> {
    const id = this.nextId++;
    const response = new Promise<unknown>((resolve, reject) =>
      this.pending.set(id, { reject, resolve }),
    );
    this.socket.send(
      JSON.stringify(params === undefined ? { id, method } : { id, method, params }),
    );
    return response;
  }
}

/*** Read the accessible name from one Chrome accessibility-tree node. */
function readAxName(node: JsonRecord): string | undefined {
  return isRecord(node.name) && typeof node.name.value === 'string' ? node.name.value : undefined;
}

/*** Read a string accessibility property from one Chrome accessibility-tree node. */
function readAxStringProperty(node: JsonRecord, name: string): string | undefined {
  const property = Array.isArray(node.properties)
    ? node.properties.find((candidate) => isRecord(candidate) && candidate.name === name)
    : undefined;
  return isRecord(property) && isRecord(property.value) && typeof property.value.value === 'string'
    ? property.value.value
    : undefined;
}

/*** Read a boolean accessibility property from one Chrome accessibility-tree node. */
function readAxBooleanProperty(node: JsonRecord, name: string): boolean | undefined {
  const property = Array.isArray(node.properties)
    ? node.properties.find((candidate) => isRecord(candidate) && candidate.name === name)
    : undefined;
  return isRecord(property) && isRecord(property.value) && typeof property.value.value === 'boolean'
    ? property.value.value
    : undefined;
}

/*** Wait until Chromium exposes its loopback DevTools endpoint. */
async function waitForAsync(url: string): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Chrome is starting.
    }
    await Bun.sleep(25);
  }
  throw new Error(`Timed out waiting for Chrome at ${url}.`);
}

/*** Narrow an unknown JSON value to a record. */
function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

try {
  await testPackedCheckboxChromiumAsync();
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
