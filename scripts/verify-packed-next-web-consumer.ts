import { strict as assert } from 'node:assert';
import { mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

type SpinnerMeasurement = Readonly<{
  readonly animation: string;
  readonly color: string;
  readonly height: number;
  readonly hydrated: string | null;
  readonly role: string | null;
  readonly width: number;
}>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-next-consumer-'));
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

/*** Run a consumer command and expose its complete failure output. */
function run(
  command: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {},
) {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1', ...environment },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${result.stdout.toString()}\n${result.stderr.toString()}`;
  assert.equal(result.exitCode, 0, `${command.join(' ')} failed:\n${output}`);
}

/*** Allocate a loopback port without coupling the consumer to a fixed host port. */
function allocatePort(): number {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const { port } = server;
  server.stop();
  return port;
}

/*** Create the smallest standalone Next consumer using only the packed public ZORA API. */
function writeConsumer(consumerRoot: string, tarballPath: string) {
  mkdirSync(join(consumerRoot, 'app'));
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-next-consumer-acceptance',
        private: true,
        scripts: { build: 'next build', start: 'next start' },
        dependencies: {
          '@ankhorage/zora': `file:${tarballPath}`,
          '@ankhorage/surface': '9.5.10',
          next: '16.0.0',
          react: '19.2.3',
          'react-dom': '19.2.3',
        },
        devDependencies: {
          '@types/react': '19.3.0',
          '@types/react-dom': '19.3.0',
          typescript: '6.0.3',
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'app', 'layout.tsx'),
    `export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><link href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" rel="icon" /></head><body>{children}</body></html>; }\n`,
  );
  writeFileSync(
    join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          allowJs: true,
          esModuleInterop: true,
          incremental: true,
          isolatedModules: true,
          jsx: 'preserve',
          lib: ['dom', 'dom.iterable', 'esnext'],
          module: 'esnext',
          moduleResolution: 'bundler',
          noEmit: true,
          plugins: [{ name: 'next' }],
          resolveJsonModule: true,
          strict: true,
          target: 'ES2017',
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'app', 'page.tsx'),
    `'use client';
import { useEffect } from 'react';
import { ActivityIndicator } from '@ankhorage/zora/web/activity-indicator';
import { ZoraProvider } from '@ankhorage/zora/web/runtime';

export default function Page() {
  useEffect(() => document.documentElement.setAttribute('data-hydrated', 'true'), []);
  return <main><ZoraProvider mode="light"><ActivityIndicator size="small" testID="light-small" /><ActivityIndicator size="large" testID="light-large" /></ZoraProvider><ZoraProvider mode="dark"><ActivityIndicator size="small" testID="dark-small" /><ActivityIndicator size="large" testID="dark-large" /></ZoraProvider></main>;
}
`,
  );
}

/*** Wait for a live HTTP response rather than assuming Next start is ready after a delay. */
async function waitForHttpAsync(url: string): Promise<void> {
  const deadline = Date.now() + 30_000;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Next production consumer did not become HTTP-ready: ${String(lastError)}`);
}

/*** Assert the server response carries all deterministic spinner invariants before browser JavaScript. */
function assertServerHtml(html: string) {
  for (const [testId, dimension] of [
    ['light-small', 20],
    ['light-large', 36],
    ['dark-small', 20],
    ['dark-large', 36],
  ] as const) {
    assert.match(html, new RegExp(`data-testid=\\"${testId}\\"`));
    assert.match(html, new RegExp(`height:${dimension}px`));
    assert.match(html, new RegExp(`width:${dimension}px`));
  }
  assert.match(html, /role="progressbar"/);
  assert.match(html, /prefers-reduced-motion: reduce/);
  assert.match(html, /<svg/);
  assert.doesNotMatch(html, /r-width-|react-native-web/i);
}

/*** Test all mode, size, and viewport combinations before and after React hydration. */
async function assertBrowserMatrixAsync(url: string) {
  const browser = await ChromeSession.createAsync(allocatePort());
  try {
    for (const viewport of [
      { height: 900, label: 'desktop', mobile: false, width: 1440 },
      { height: 844, label: 'mobile', mobile: true, width: 390 },
    ] as const) {
      await browser.setViewportAsync(viewport);
      await browser.setScriptsEnabledAsync(false);
      await browser.navigateAsync(url);
      await browser.waitForDocumentAsync();
      await assertMeasurementsAsync(browser, viewport.label, 'server');
      await browser.setScriptsEnabledAsync(true);
      await browser.navigateAsync(url);
      await browser.waitForHydrationAsync();
      await assertMeasurementsAsync(browser, viewport.label, 'hydrated');
      await browser.emulateReducedMotionAsync();
      const animation = await browser.measureAsync('light-small');
      assert.equal(animation.animation, 'none', `${viewport.label} reduced motion still animates.`);
      await browser.clearReducedMotionAsync();
    }
    assert.deepEqual(
      browser.exceptions,
      [],
      `Chromium exceptions:\n${browser.exceptions.join('\n')}`,
    );
    assert.deepEqual(
      browser.consoleErrors,
      [],
      `Chromium console errors:\n${browser.consoleErrors.join('\n')}`,
    );
  } finally {
    browser.close();
  }
}

/*** Assert semantic presentation and fixed bounds for each published spinner size and theme scope. */
async function assertMeasurementsAsync(browser: ChromeSession, viewport: string, phase: string) {
  for (const [testId, dimension] of [
    ['light-small', 20],
    ['light-large', 36],
    ['dark-small', 20],
    ['dark-large', 36],
  ] as const) {
    const measurement = await browser.measureAsync(testId);
    assert.equal(measurement.width, dimension, `${viewport} ${phase} ${testId} width changed.`);
    assert.equal(measurement.height, dimension, `${viewport} ${phase} ${testId} height changed.`);
    assert.equal(
      measurement.role,
      'progressbar',
      `${viewport} ${phase} ${testId} lacks semantics.`,
    );
    assert.notEqual(measurement.color, '', `${viewport} ${phase} ${testId} lacks theme color.`);
    if (phase === 'hydrated') assert.equal(measurement.hydrated, 'true');
  }
}

/*** Drive Chromium through CDP so server-only and hydrated frames use the same real browser engine. */
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

  static async createAsync(port: number): Promise<ChromeSession> {
    const process = Bun.spawn(
      [
        chromiumCommand,
        '--headless=new',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-address=127.0.0.1',
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${join(temporaryRoot, `chrome-${port}`)}`,
        'about:blank',
      ],
      { stderr: 'pipe', stdout: 'pipe' },
    );
    try {
      await waitForHttpAsync(`http://127.0.0.1:${port}/json/version`);
      const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
        method: 'PUT',
      });
      const target = (await response.json()) as { readonly webSocketDebuggerUrl?: string };
      assert.ok(target.webSocketDebuggerUrl, 'Chrome did not create a DevTools target.');
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

  async clearReducedMotionAsync() {
    await this.sendAsync('Emulation.setEmulatedMedia', { features: [] });
  }
  close() {
    this.socket.close();
    this.process.kill();
  }
  async emulateReducedMotionAsync() {
    await this.sendAsync('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
  }
  async measureAsync(testId: string): Promise<SpinnerMeasurement> {
    return this.evaluateAsync(
      `(() => { const node = document.querySelector('[data-testid="${testId}"]'); if (!node) throw new Error('missing ${testId}'); const style = getComputedStyle(node); const svg = node.querySelector('svg'); return { animation: svg ? getComputedStyle(svg).animationName : '', color: svg?.querySelector('circle')?.getAttribute('stroke') ?? '', height: node.getBoundingClientRect().height, hydrated: document.documentElement.getAttribute('data-hydrated'), role: node.getAttribute('role'), width: node.getBoundingClientRect().width }; })()`,
    );
  }
  async navigateAsync(url: string) {
    await this.sendAsync('Page.navigate', { url });
  }
  async setScriptsEnabledAsync(enabled: boolean) {
    await this.sendAsync('Emulation.setScriptExecutionDisabled', { value: !enabled });
  }
  async setViewportAsync(viewport: {
    readonly height: number;
    readonly mobile: boolean;
    readonly width: number;
  }) {
    await this.sendAsync('Emulation.setDeviceMetricsOverride', {
      deviceScaleFactor: 1,
      height: viewport.height,
      mobile: viewport.mobile,
      width: viewport.width,
    });
  }
  async waitForDocumentAsync() {
    await this.waitForAsync(`document.readyState === 'complete'`);
  }
  async waitForHydrationAsync() {
    await this.waitForAsync(`document.documentElement.getAttribute('data-hydrated') === 'true'`);
  }
  private async evaluateAsync<T>(expression: string): Promise<T> {
    const response = await this.sendAsync('Runtime.evaluate', {
      awaitPromise: true,
      expression,
      returnByValue: true,
    });
    assert.ok(
      isRecord(response) && isRecord(response.result) && 'value' in response.result,
      `Chrome returned no value for ${expression}`,
    );
    return response.result.value as T;
  }
  private handleMessage(data: unknown) {
    const message = JSON.parse(String(data)) as {
      readonly id?: number;
      readonly method?: string;
      readonly params?: {
        readonly exceptionDetails?: { readonly text?: string };
        readonly entry?: { readonly level?: string; readonly text?: string };
      };
      readonly result?: unknown;
    };
    if (message.method === 'Runtime.exceptionThrown')
      this.exceptions.push(message.params?.exceptionDetails?.text ?? 'Unknown exception');
    if (message.method === 'Log.entryAdded' && message.params?.entry?.level === 'error')
      this.consoleErrors.push(message.params.entry.text ?? 'Unknown console error');
    if (message.id === undefined) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    pending.resolve(message.result);
  }
  private sendAsync(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { reject, resolve });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  private async waitForAsync(expression: string) {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      if (await this.evaluateAsync<boolean>(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(`Timed out waiting for ${expression}`);
  }
}

/*** Narrow untyped CDP response values before accessing their nested result payload. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

try {
  const packageRoot = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  run(['bun', 'run', 'build'], repositoryRoot);
  mkdirSync(packageRoot);
  run(
    ['npm', 'pack', '--ignore-scripts', '--silent', '--pack-destination', packageRoot],
    repositoryRoot,
    { npm_config_cache: join(temporaryRoot, 'npm-cache') },
  );
  const tarballs = readdirSync(packageRoot).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one packed ZORA tarball.');
  mkdirSync(consumerRoot);
  writeConsumer(consumerRoot, join(packageRoot, tarballs[0] ?? ''));
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  run(['bun', 'run', 'build'], consumerRoot);
  const port = allocatePort();
  const server = Bun.spawn(['bun', 'run', 'start', '--', '--port', String(port)], {
    cwd: consumerRoot,
    env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1' },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  try {
    const url = `http://127.0.0.1:${port}`;
    await waitForHttpAsync(url);
    assertServerHtml(await (await fetch(url)).text());
    await assertBrowserMatrixAsync(url);
  } finally {
    server.kill();
  }
  console.log(
    'Packed Next 16 production consumer SSR and Chromium ActivityIndicator matrix passed.',
  );
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
