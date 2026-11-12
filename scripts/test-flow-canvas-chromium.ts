import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { assert } from './utils/assert';

type Rect = Readonly<{ height: number; width: number; x: number; y: number }>;
type FlowState = Readonly<{
  connections: number;
  events: readonly string[];
  nodes: readonly { id: string; x: number; y: number }[];
  selected: readonly string[];
  viewport: { pan: { x: number; y: number }; zoom: number };
}>;
type JsonRecord = Record<string, unknown>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-flow-canvas-chromium-'));
const artifactsDirectory = process.env.FLOW_ARTIFACT_DIR ?? join(temporaryRoot, 'artifacts');
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');
const reactNativeWebEntry = Bun.resolveSync('react-native-web', repositoryRoot);
const reactNativeSvgWebEntry = Bun.resolveSync(
  'react-native-svg/lib/module/index.js',
  repositoryRoot,
);

/*** Exercise controlled FlowCanvas interactions through real Chromium pointer and keyboard input. */
async function testFlowCanvasChromiumAsync() {
  const bundlePath = join(temporaryRoot, 'flow-canvas-acceptance.js');
  const build = await Bun.build({
    entrypoints: [join(repositoryRoot, 'test-fixtures/flowCanvasChromiumAcceptance.tsx')],
    format: 'esm',
    naming: 'flow-canvas-acceptance.js',
    outdir: temporaryRoot,
    plugins: [
      {
        name: 'react-native-web',
        setup(build) {
          build.onResolve({ filter: /^react-native$/ }, () => ({ path: reactNativeWebEntry }));
          build.onResolve({ filter: /^react-native-svg$/ }, () => ({
            path: reactNativeSvgWebEntry,
          }));
          build.onResolve({ filter: /^\.\// }, (args) => {
            const webPath = resolve(args.resolveDir, `${args.path}.web.js`);
            return args.resolveDir.includes('react-native-svg/lib/module') && existsSync(webPath)
              ? { path: webPath }
              : undefined;
          });
        },
      },
    ],
    target: 'browser',
  });
  assert(build.success, build.logs.map(({ message }) => message).join('\n'));
  const server = Bun.serve({
    fetch(request) {
      return new URL(request.url).pathname === '/flow-canvas-acceptance.js'
        ? new Response(Bun.file(bundlePath))
        : new Response(
            '<!doctype html><meta charset="utf-8"><script type="module" src="/flow-canvas-acceptance.js"></script>',
            { headers: { 'content-type': 'text/html' } },
          );
    },
    port: 0,
  });
  const browser = await ChromeSession.createAsync(await dynamicPortAsync());
  try {
    await browser.navigateAsync(`http://127.0.0.1:${server.port}`);
    const initial = await browser.waitForStateAsync((state) => state.nodes.length === 2);
    const source = await browser.rectAsync('[data-testid="flow-port-source-out"]');
    const target = await browser.rectAsync('[data-testid="flow-port-target-in"]');
    const canvas = await browser.rectAsync('[data-testid="flow-canvas-viewport"]');
    await browser.assertPathAnchorsAsync(source, target, canvas);
    await browser.clickAsync(await browser.rectAsync('[aria-label="Insert task"]'));
    await browser.clickAsync(await browser.rectAsync('[data-testid="flow-node-source"]'));
    await browser.waitForStateAsync((state) => state.selected.includes('source'));
    await browser.dragAsync(await browser.rectAsync('[data-testid="flow-node-source"]'), 96, 48);
    const moved = await browser.waitForStateAsync(
      (state) =>
        state.nodes.find((node) => node.id === 'source')?.x !==
        initial.nodes.find((node) => node.id === 'source')?.x,
    );
    await browser.clickAsync(source);
    await browser.clickAsync(target);
    await browser.waitForStateAsync((state) => state.connections === 1);
    await browser.clickAsync(await browser.rectAsync('[aria-label="Connection source-target"]'));
    await browser.waitForStateAsync((state) => state.connections === 0);
    await browser.clickAsync(await browser.rectAsync('[aria-label="Zoom in"]'));
    await browser.clickAsync(await browser.rectAsync('[aria-label="Undo"]'));
    await browser.keyAsync('TAB');
    const final = await browser.waitForStateAsync(
      (state) =>
        state.events.includes('insert') &&
        state.events.includes('connect') &&
        state.events.includes('disconnect') &&
        state.events.includes('undo') &&
        state.events.includes('move') &&
        state.viewport.zoom > 1,
    );
    assert(
      final.viewport.pan.x === moved.viewport.pan.x &&
        final.viewport.pan.y === moved.viewport.pan.y,
      'Node drag must not pan the canvas.',
    );
    await browser.screenshotAsync(join(artifactsDirectory, 'flow-canvas-desktop.png'));
    await browser.setViewportAsync(390, 844);
    await browser.screenshotAsync(join(artifactsDirectory, 'flow-canvas-mobile.png'));
    assert(
      browser.exceptions.length === 0,
      `Chromium exceptions: ${browser.exceptions.join('\n')}`,
    );
    assert(
      browser.consoleErrors.length === 0,
      `Chromium console errors: ${browser.consoleErrors.join('\n')}`,
    );
    console.log(`Chromium FlowCanvas acceptance passed: ${JSON.stringify(final)}`);
  } finally {
    browser.close();
    server.stop();
  }
}

/*** Allocate a loopback DevTools port without a fixed-port test assumption. */
async function dynamicPortAsync() {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
}

/*** Drive Chromium through the DevTools Protocol so assertions use native browser input. */
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
  static async createAsync(debugPort: number) {
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
      const target = (await response.json()) as { webSocketDebuggerUrl?: unknown };
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
        ['Page.enable', 'Runtime.enable', 'Log.enable'].map((method) => session.sendAsync(method)),
      );
      return session;
    } catch (error) {
      process.kill();
      throw error;
    }
  }
  async navigateAsync(url: string) {
    await this.sendAsync('Page.navigate', { url });
  }
  async setViewportAsync(width: number, height: number) {
    await this.sendAsync('Emulation.setDeviceMetricsOverride', {
      deviceScaleFactor: 1,
      height,
      mobile: true,
      width,
    });
  }
  async keyAsync(key: string) {
    await this.sendAsync('Input.dispatchKeyEvent', { key, type: 'keyDown' });
    await this.sendAsync('Input.dispatchKeyEvent', { key, type: 'keyUp' });
  }
  async rectAsync(selector: string) {
    const deadline = Date.now() + 30_000;
    let last: Rect | null = null;
    while (Date.now() < deadline) {
      const rect = await this.evaluateAsync<Rect | null>(
        `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!(element instanceof HTMLElement)) return null; const { x, y, width, height } = element.getBoundingClientRect(); return { x, y, width, height }; })()`,
      );
      last = rect;
      if (rect !== null && rect.width > 0 && rect.height > 0) return rect;
      await this.evaluateAsync('new Promise((resolve) => requestAnimationFrame(resolve))');
    }
    throw new Error(`Missing usable target ${selector}: ${JSON.stringify(last)}`);
  }
  async clickAsync(rect: Rect) {
    await this.mouseAsync(rect.x + rect.width / 2, rect.y + rect.height / 2, 'mousePressed');
    await this.mouseAsync(rect.x + rect.width / 2, rect.y + rect.height / 2, 'mouseReleased');
  }
  async dragAsync(rect: Rect, deltaX: number, deltaY: number) {
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    await this.mouseAsync(x, y, 'mousePressed');
    await this.mouseAsync(x + deltaX, y + deltaY, 'mouseMoved');
    await this.mouseAsync(x + deltaX, y + deltaY, 'mouseReleased');
  }
  async assertPathAnchorsAsync(source: Rect, target: Rect, canvas: Rect) {
    const d = await this.evaluateAsync<string | null>(
      'document.querySelector("svg path")?.getAttribute("d") ?? null',
    );
    assert(d !== null, 'Expected a rendered FlowCanvas edge path.');
    const values = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    assert(values.length >= 8, `Unexpected edge path ${d}.`);
    const expected = [
      source.x + source.width / 2 - canvas.x,
      source.y + source.height / 2 - canvas.y,
      target.x + target.width / 2 - canvas.x,
      target.y + target.height / 2 - canvas.y,
    ];
    assert(
      Math.abs(values[0]! - expected[0]!) < 2 &&
        Math.abs(values[1]! - expected[1]!) < 2 &&
        Math.abs(values.at(-2)! - expected[2]!) < 2 &&
        Math.abs(values.at(-1)! - expected[3]!) < 2,
      `Edge did not use measured port centers: ${JSON.stringify({ d, expected })}`,
    );
  }
  async screenshotAsync(path: string) {
    mkdirSync(resolve(path, '..'), { recursive: true });
    const result = await this.sendAsync('Page.captureScreenshot', { format: 'png' });
    assert(isRecord(result) && typeof result.data === 'string', 'Chrome returned no screenshot.');
    writeFileSync(path, Buffer.from(result.data, 'base64'));
  }
  async waitForStateAsync(predicate: (state: FlowState) => boolean): Promise<FlowState> {
    const deadline = Date.now() + 30_000;
    let last: FlowState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<FlowState | null>(
        'window.flowAcceptance?.read() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.evaluateAsync('new Promise((resolve) => requestAnimationFrame(resolve))');
    }
    throw new Error(`Timed out waiting for FlowCanvas state: ${JSON.stringify(last)}`);
  }
  close() {
    this.socket.close();
    this.process.kill();
  }
  private async mouseAsync(
    x: number,
    y: number,
    type: 'mousePressed' | 'mouseMoved' | 'mouseReleased',
  ) {
    await this.sendAsync('Input.dispatchMouseEvent', { button: 'left', clickCount: 1, type, x, y });
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
  private handleMessage(data: unknown) {
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
      if (!pending) return;
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
    this.socket.send(JSON.stringify(params ? { id, method, params } : { id, method }));
    return response;
  }
}

/*** Wait for Chrome's loopback debugging endpoint. */
async function waitForAsync(url: string): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* Chrome is starting. */
    }
    await Bun.sleep(25);
  }
  throw new Error(`Timed out waiting for Chrome at ${url}.`);
}
function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
try {
  await testFlowCanvasChromiumAsync();
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
