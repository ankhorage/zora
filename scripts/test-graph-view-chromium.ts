import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { assert } from './utils/assert';

type JsonRecord = Record<string, unknown>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-graph-view-chromium-'));
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

/*** Execute the actual Cytoscape canvas double-press regression in headless Chromium. */
async function testGraphViewChromiumAsync() {
  const bundlePath = join(temporaryRoot, 'graph-view-acceptance.js');
  const build = await Bun.build({
    entrypoints: [join(repositoryRoot, 'test-fixtures/graphViewChromiumAcceptance.tsx')],
    format: 'esm',
    naming: 'graph-view-acceptance.js',
    outdir: temporaryRoot,
    target: 'browser',
  });
  assert(build.success, build.logs.map(({ message }) => message).join('\n'));
  const server = Bun.serve({
    fetch(request) {
      const path = new URL(request.url).pathname;
      if (path === '/graph-view-acceptance.js') return new Response(Bun.file(bundlePath));
      return new Response(
        '<!doctype html><meta charset="utf-8"><script type="module" src="/graph-view-acceptance.js"></script>',
        { headers: { 'content-type': 'text/html' } },
      );
    },
    port: 0,
  });
  const browser = await ChromeSession.createAsync(await dynamicPortAsync());
  try {
    await browser.navigateAsync(`http://127.0.0.1:${server.port}`);
    const initial = await browser.waitForStateAsync(
      (state) => state.ready && state.measurement !== null,
    );
    const before = requireMeasurement(initial);
    const beforeViewport = requireViewport(initial);
    const beforeSorts = initial.layoutSorts;
    const source = before.nodes.find((node) => node.id === 'src');
    assert(source !== undefined, 'Public measureNodes() did not return src.');

    await browser.clickAsync(source.position.x, source.position.y, 1);
    const selected = await browser.waitForStateAsync(
      (state) =>
        state.selected &&
        state.events.filter((event) => event.id === 'src' && event.type === 'press').length === 1 &&
        state.layoutCompletions > initial.layoutCompletions,
    );
    assert(
      selected.layoutSorts === beforeSorts,
      `Selection unexpectedly reran the layout: ${JSON.stringify({ beforeSorts, afterSorts: selected.layoutSorts })}`,
    );
    await browser.clickAsync(source.position.x, source.position.y, 2);
    const after = await browser.waitForStateAsync(
      (state) => state.events.filter(isSourceDoublePress).length === 1,
    );
    const afterMeasurement = requireMeasurement(after);
    const afterViewport = requireViewport(after);

    assert(
      after.events.filter(isSourceDoublePress).length === 1,
      'Expected exactly one src double-press.',
    );
    assert(
      JSON.stringify(afterMeasurement) === JSON.stringify(before),
      `Selection changed public rendered hit geometry: ${JSON.stringify({ before, after: afterMeasurement })}`,
    );
    assert(
      JSON.stringify(afterViewport) === JSON.stringify(beforeViewport),
      `Selection changed public viewport: ${JSON.stringify({ before: beforeViewport, after: afterViewport })}`,
    );
    assert(
      browser.exceptions.length === 0,
      `Chromium exceptions: ${browser.exceptions.join('\n')}`,
    );
    assert(
      browser.consoleErrors.length === 0,
      `Chromium console errors: ${browser.consoleErrors.join('\n')}`,
    );
    console.log(
      `Chromium GraphView acceptance passed: src double-press once; layout sorts ${beforeSorts}; measurement and viewport unchanged.`,
    );
  } finally {
    browser.close();
    server.stop();
  }
}

/*** Allocate a loopback port without making a fixed-port test assumption. */
async function dynamicPortAsync(): Promise<number> {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
}

/*** Distinguish the required public src double-press from unrelated graph events. */
function isSourceDoublePress(event: { readonly id: string; readonly type: string }) {
  return event.id === 'src' && event.type === 'double-press';
}

/*** Narrow the browser fixture's serializable public GraphView state. */
function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*** Require the stable public rendered-node measurement used for native input coordinates. */
function requireMeasurement(state: GraphAcceptanceState): GraphMeasurement {
  assert(state.measurement !== null, 'Public measureNodes() returned null.');
  return state.measurement;
}

/*** Require a stable public viewport before comparing the selection presentation update. */
function requireViewport(state: GraphAcceptanceState): GraphViewport {
  assert(state.viewport !== null, 'Public getViewport() returned null.');
  return state.viewport;
}

interface GraphAcceptanceState {
  readonly events: readonly { readonly id: string; readonly type: string }[];
  readonly layoutCompletions: number;
  readonly layoutSorts: number;
  readonly measurement: GraphMeasurement | null;
  readonly ready: boolean;
  readonly selected: boolean;
  readonly viewport: GraphViewport | null;
}

interface GraphMeasurement {
  readonly nodes: readonly {
    readonly id: string;
    readonly position: { readonly x: number; readonly y: number };
    readonly size: { readonly height: number; readonly width: number };
  }[];
  readonly viewport: { readonly height: number; readonly width: number };
}

interface GraphViewport {
  readonly pan: { readonly x: number; readonly y: number };
  readonly zoom: number;
}

/*** Drive an isolated Chrome page through its public DevTools Protocol endpoint. */
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
    const profile = join(temporaryRoot, `chrome-${debugPort}`);
    const process = Bun.spawn(
      [
        chromiumCommand,
        '--headless=new',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-address=127.0.0.1',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profile}`,
        'about:blank',
      ],
      { stderr: 'pipe', stdout: 'pipe' },
    );
    try {
      await waitForAsync(`http://127.0.0.1:${debugPort}/json/version`);
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, {
        method: 'PUT',
      });
      assert(response.ok, `Chrome page creation returned HTTP ${response.status}.`);
      const target = (await response.json()) as { readonly webSocketDebuggerUrl?: unknown };
      assert(
        typeof target.webSocketDebuggerUrl === 'string',
        'Chrome page creation returned no debugger URL.',
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

  async navigateAsync(url: string): Promise<void> {
    await this.sendAsync('Page.navigate', { url });
  }

  async clickAsync(x: number, y: number, clickCount: number): Promise<void> {
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      clickCount,
    });
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      clickCount,
    });
  }

  async waitForStateAsync(
    predicate: (state: GraphAcceptanceState) => boolean,
  ): Promise<GraphAcceptanceState> {
    const deadline = Date.now() + 30_000;
    let last: GraphAcceptanceState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<GraphAcceptanceState>(
        'window.graphAcceptance?.read() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await Bun.sleep(25);
    }
    throw new Error(
      `Timed out waiting for a stable public GraphView state: ${JSON.stringify(last)}`,
    );
  }

  close(): void {
    this.socket.close();
    this.process.kill();
  }

  private async evaluateAsync<T>(expression: string): Promise<T> {
    const result = await this.sendAsync('Runtime.evaluate', { expression, returnByValue: true });
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

/*** Wait only for a concrete Chrome readiness condition, with a bounded diagnostic timeout. */
async function waitForAsync(url: string): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Chrome is still starting its loopback debugging endpoint.
    }
    await Bun.sleep(25);
  }
  throw new Error(`Timed out waiting for Chrome at ${url}.`);
}

try {
  await testGraphViewChromiumAsync();
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
