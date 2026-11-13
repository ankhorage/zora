import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

import { assert } from './utils/assert';

type Sample = Readonly<{ durationMs: number; heapBytes?: number; longTaskCount: number }>;
type Result = Readonly<{
  medianMs: number;
  p95Ms: number;
  samples: readonly Sample[];
  size: number;
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
  const browser = await BenchmarkBrowser.createAsync();
  try {
    const results = await Promise.all(
      [25, 200, 1000].map((size) => benchmarkSizeAsync(browser, server.port, size)),
    );
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(
      join(artifactDirectory, 'flow-canvas-benchmark.json'),
      JSON.stringify(
        {
          environment: { bun: Bun.version, platform: process.platform, chromium: chromiumCommand },
          results,
        },
        null,
        2,
      ),
    );
    console.log(JSON.stringify(results, null, 2));
  } finally {
    browser.close();
    server.stop();
  }
}

/** Collect repeated samples without arbitrary pass thresholds; CI retains transparent baselines. */
async function benchmarkSizeAsync(
  browser: BenchmarkBrowser,
  port: number,
  size: number,
): Promise<Result> {
  const samples: Sample[] = [];
  for (let index = 0; index < 7; index += 1)
    samples.push(await browser.sampleAsync(`http://127.0.0.1:${port}/?size=${size}`));
  const durations = samples.map(({ durationMs }) => durationMs).sort((left, right) => left - right);
  return {
    medianMs: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    samples,
    size,
  };
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
    const before = performance.now();
    await this.sendAsync('Page.navigate', { url });
    await this.evaluateAsync(
      'new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))',
    );
    await this.evaluateAsync(
      '(() => { const viewport = document.querySelector("[data-testid=flow-benchmark-viewport]"); viewport?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 20, clientY: 340 })); viewport?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 56, clientY: 368 })); viewport?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 56, clientY: 368 })); document.querySelector("[aria-label=Zoom\\ in]")?.dispatchEvent(new MouseEvent("click", { bubbles: true })); })()',
    );
    await this.evaluateAsync(
      'new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))',
    );
    const metrics = (await this.sendAsync('Performance.getMetrics')) as {
      metrics: readonly { name: string; value: number }[];
    };
    const heapBytes = metrics.metrics.find(({ name }) => name === 'JSHeapUsedSize')?.value;
    return {
      durationMs: performance.now() - before,
      ...(heapBytes === undefined ? {} : { heapBytes }),
      longTaskCount: await this.evaluateAsync<number>(
        'performance.getEntriesByType("longtask").length',
      ),
    };
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
