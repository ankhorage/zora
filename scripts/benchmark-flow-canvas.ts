import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { assert } from './utils/assert';

type Sample = Readonly<{
  heapBytes?: number;
  initialRenderMs: number;
  interactionMs: Readonly<{
    connectionUpdate: number;
    nodeDrag: number;
    pan: number;
    zoom: number;
  }>;
  longTaskCount: number;
}>;
type Result = Readonly<{
  cold: Sample;
  medianMs: Readonly<
    Record<'connectionUpdate' | 'initialRender' | 'nodeDrag' | 'pan' | 'zoom', number>
  >;
  p95Ms: Readonly<
    Record<'connectionUpdate' | 'initialRender' | 'nodeDrag' | 'pan' | 'zoom', number>
  >;
  samples: readonly Sample[];
  size: number;
  warmupSamples: readonly Sample[];
}>;
type BenchmarkState = Readonly<{
  connections: number;
  firstNode?: Readonly<{ x: number; y: number }>;
  viewport: Readonly<{ pan: Readonly<{ x: number; y: number }>; zoom: number }>;
}>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-flow-benchmark-'));
const artifactDirectory =
  process.env.FLOW_BENCHMARK_ARTIFACT_DIR ?? join(temporaryRoot, 'artifacts');
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

/** Measure mount, pan, zoom, node movement, and connection layout work on public FlowCanvas graphs. */
async function benchmarkFlowCanvasAsync() {
  const build = await Bun.build({
    entrypoints: [join(repositoryRoot, 'test-fixtures', 'flowCanvasBenchmark.tsx')],
    format: 'esm',
    naming: 'benchmark.js',
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
    port: 0,
    fetch: (request) =>
      new URL(request.url).pathname === '/benchmark.js'
        ? new Response(Bun.file(join(temporaryRoot, 'benchmark.js')))
        : new Response('<script type="module" src="/benchmark.js"></script>', {
            headers: { 'content-type': 'text/html' },
          }),
  });
  let browser: BenchmarkBrowser | undefined;
  try {
    browser = await BenchmarkBrowser.createAsync();
    const results: Result[] = [];
    for (const size of [25, 200, 1000] as const)
      results.push(await benchmarkSizeAsync(browser, server.port, size));
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(
      join(artifactDirectory, 'flow-canvas-benchmark.json'),
      JSON.stringify(
        {
          environment: {
            bun: Bun.version,
            chromium: await browser.versionAsync(),
            command: chromiumCommand,
            platform: process.platform,
          },
          results,
        },
        null,
        2,
      ),
    );
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(
      join(artifactDirectory, 'flow-canvas-benchmark-failure.json'),
      JSON.stringify({ error: String(error) }, null, 2),
    );
    throw error;
  } finally {
    browser?.close();
    server.stop();
  }
}

/** Collect repeated samples without arbitrary pass thresholds; CI retains transparent baselines. */
async function benchmarkSizeAsync(
  browser: BenchmarkBrowser,
  port: number,
  size: number,
): Promise<Result> {
  const url = `http://127.0.0.1:${port}/?size=${size}`;
  const cold = await browser.sampleAsync(url);
  const warmupSamples = [await browser.sampleAsync(url), await browser.sampleAsync(url)];
  const samples = await collectSamplesAsync(browser, url, 7);
  const summary = (key: 'connectionUpdate' | 'initialRender' | 'nodeDrag' | 'pan' | 'zoom') => {
    const values = samples
      .map((sample) =>
        key === 'initialRender' ? sample.initialRenderMs : sample.interactionMs[key],
      )
      .sort((left, right) => left - right);
    return { median: percentile(values, 0.5), p95: percentile(values, 0.95) };
  };
  return {
    cold,
    medianMs: Object.fromEntries(
      ['connectionUpdate', 'initialRender', 'nodeDrag', 'pan', 'zoom'].map((key) => [
        key,
        summary(key as 'connectionUpdate' | 'initialRender' | 'nodeDrag' | 'pan' | 'zoom').median,
      ]),
    ) as Result['medianMs'],
    p95Ms: Object.fromEntries(
      ['connectionUpdate', 'initialRender', 'nodeDrag', 'pan', 'zoom'].map((key) => [
        key,
        summary(key as 'connectionUpdate' | 'initialRender' | 'nodeDrag' | 'pan' | 'zoom').p95,
      ]),
    ) as Result['p95Ms'],
    samples,
    size,
    warmupSamples,
  };
}

/** Collect independent, sequentially navigated measurement samples after dedicated warmups. */
async function collectSamplesAsync(browser: BenchmarkBrowser, url: string, count: number) {
  const samples: Sample[] = [];
  for (let index = 0; index < count; index += 1) samples.push(await browser.sampleAsync(url));
  return samples;
}

/** Select a deterministic nearest-rank percentile for a small measured sample set. */
function percentile(values: readonly number[], percentile: number): number {
  return values[Math.min(values.length - 1, Math.ceil(values.length * percentile) - 1)]!;
}

/** Drive Chromium through CDP so timing covers actual browser rendering and input dispatch. */
class BenchmarkBrowser {
  private nextId = 1;
  private readonly pending = new Map<
    number,
    { reject(reason: unknown): void; resolve(value: unknown): void }
  >();
  private constructor(
    private readonly process: ReturnType<typeof Bun.spawn>,
    private readonly socket: WebSocket,
  ) {
    socket.onmessage = (event) => this.onMessage(event.data);
  }
  static async createAsync() {
    const port = await freePortAsync();
    const process = Bun.spawn([
      chromiumCommand,
      '--headless=new',
      '--remote-debugging-address=127.0.0.1',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${join(temporaryRoot, 'chrome')}`,
      'about:blank',
    ]);
    await waitForAsync(`http://127.0.0.1:${port}/json/version`);
    const target = (await (
      await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })
    ).json()) as { webSocketDebuggerUrl: string };
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      socket.onopen = () => resolve();
      socket.onerror = () => reject(new Error('Chrome DevTools socket failed to open.'));
    });
    const browser = new BenchmarkBrowser(process, socket);
    await Promise.all(
      ['Page.enable', 'Performance.enable', 'Runtime.enable'].map((method) =>
        browser.sendAsync(method),
      ),
    );
    return browser;
  }
  async sampleAsync(url: string): Promise<Sample> {
    const renderStart = performance.now();
    await this.sendAsync('Page.navigate', { url });
    const initial = await this.waitForStateAsync((state) => state.firstNode !== undefined);
    const initialRenderMs = performance.now() - renderStart;
    const node = await this.rectAsync('[data-testid="flow-node-node-0"]');
    const viewport = await this.rectAsync('[data-testid="flow-benchmark-viewport"]');

    const nodeDragStart = performance.now();
    await this.dragAsync(node, 32, 18);
    await this.waitForStateAsync(
      (state) =>
        state.firstNode?.x !== initial.firstNode?.x &&
        state.viewport.pan.x === initial.viewport.pan.x &&
        state.viewport.pan.y === initial.viewport.pan.y,
    );
    const nodeDrag = performance.now() - nodeDragStart;

    const beforePan = await this.readStateAsync();
    const panStart = performance.now();
    await this.dragFromAsync(viewport.x + 24, viewport.y + viewport.height - 20, 24, 16);
    await this.waitForStateAsync(
      (state) =>
        state.viewport.pan.x !== beforePan.viewport.pan.x ||
        state.viewport.pan.y !== beforePan.viewport.pan.y,
    );
    const pan = performance.now() - panStart;

    const beforeZoom = await this.readStateAsync();
    const zoomStart = performance.now();
    await this.clickAsync(await this.rectAsync('[aria-label="Zoom in"]'));
    await this.waitForStateAsync((state) => state.viewport.zoom > beforeZoom.viewport.zoom);
    const zoom = performance.now() - zoomStart;

    const beforeConnection = await this.readStateAsync();
    const connectionStart = performance.now();
    await this.clickAsync(await this.rectAsync('[data-testid="flow-port-node-0-out"]'));
    await this.clickAsync(await this.rectAsync('[data-testid="flow-port-node-1-in"]'));
    await this.waitForStateAsync((state) => state.connections === beforeConnection.connections + 1);
    const connectionUpdate = performance.now() - connectionStart;
    const metrics = (await this.sendAsync('Performance.getMetrics')) as {
      metrics: readonly { name: string; value: number }[];
    };
    const heapBytes = metrics.metrics.find(({ name }) => name === 'JSHeapUsedSize')?.value;
    return {
      ...(heapBytes === undefined ? {} : { heapBytes }),
      initialRenderMs,
      interactionMs: { connectionUpdate, nodeDrag, pan, zoom },
      longTaskCount: await this.evaluateAsync<number>(
        'performance.getEntriesByType("longtask").length',
      ),
    };
  }
  async versionAsync() {
    const version = (await this.sendAsync('Browser.getVersion')) as { product?: string };
    return version.product ?? 'unknown';
  }
  close() {
    this.socket.close();
    this.process.kill();
  }
  private async evaluateAsync<T>(expression: string): Promise<T> {
    const result = (await this.sendAsync('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    })) as { result: { value: T } };
    return result.result.value;
  }
  private async readStateAsync(): Promise<BenchmarkState> {
    return this.evaluateAsync<BenchmarkState>('window.flowBenchmark?.read()');
  }
  private async waitForStateAsync(predicate: (state: BenchmarkState) => boolean) {
    const deadline = Date.now() + 30_000;
    let state: BenchmarkState | undefined;
    while (Date.now() < deadline) {
      state = await this.evaluateAsync<BenchmarkState | undefined>('window.flowBenchmark?.read()');
      if (state !== undefined && predicate(state)) return state;
      await Bun.sleep(16);
    }
    throw new Error(`Timed out waiting for benchmark host state: ${JSON.stringify(state)}`);
  }
  private async rectAsync(selector: string) {
    const rect = await this.evaluateAsync<
      Readonly<{ height: number; width: number; x: number; y: number }> | undefined
    >(
      `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!(element instanceof HTMLElement)) return undefined; const { height, width, x, y } = element.getBoundingClientRect(); return width > 0 && height > 0 ? { height, width, x, y } : undefined; })()`,
    );
    assert(rect !== undefined, `Missing benchmark target ${selector}.`);
    return rect;
  }
  private async clickAsync(
    rect: Readonly<{ height: number; width: number; x: number; y: number }>,
  ) {
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    await this.mouseAsync(x, y, 'mousePressed');
    await this.mouseAsync(x, y, 'mouseReleased');
  }
  private async dragAsync(
    rect: Readonly<{ height: number; width: number; x: number; y: number }>,
    deltaX: number,
    deltaY: number,
  ) {
    await this.dragFromAsync(rect.x + rect.width / 2, rect.y + rect.height / 2, deltaX, deltaY);
  }
  private async dragFromAsync(x: number, y: number, deltaX: number, deltaY: number) {
    await this.mouseAsync(x, y, 'mousePressed');
    await this.mouseAsync(x + deltaX / 2, y + deltaY / 2, 'mouseMoved');
    await this.mouseAsync(x + deltaX, y + deltaY, 'mouseMoved');
    await this.mouseAsync(x + deltaX, y + deltaY, 'mouseReleased');
  }
  private async mouseAsync(
    x: number,
    y: number,
    type: 'mousePressed' | 'mouseMoved' | 'mouseReleased',
  ) {
    await this.sendAsync('Input.dispatchMouseEvent', {
      button: type === 'mouseMoved' ? 'none' : 'left',
      buttons: type === 'mouseReleased' ? 0 : 1,
      type,
      x,
      y,
    });
  }
  private sendAsync(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { reject, resolve }));
  }
  private onMessage(data: unknown) {
    const message = JSON.parse(String(data)) as { id?: number; error?: unknown; result?: unknown };
    if (message.id === undefined) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) pending.reject(message.error);
    else pending.resolve(message.result);
  }
}

/** Allocate an ephemeral loopback debugging port. */
async function freePortAsync() {
  const server = Bun.serve({ port: 0, fetch: () => new Response('') });
  const port = server.port;
  server.stop();
  return port;
}
/** Wait for an HTTP endpoint to become ready. */
async function waitForAsync(url: string) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await Bun.sleep(100);
  }
  throw new Error(`Timed out waiting for ${url}.`);
}

await benchmarkFlowCanvasAsync();
