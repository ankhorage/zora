import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { assert } from './utils/assert';

type JsonRecord = Record<string, unknown>;
type ChessRect = Readonly<{ height: number; width: number; x: number; y: number }>;
type ChessState = Readonly<{
  events: readonly string[];
  moves: readonly { readonly from: Cell; readonly to: Cell }[];
  rects: Readonly<Record<string, ChessRect>>;
}>;
type Cell = Readonly<{ column: number; row: number }>;

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-chess-chromium-'));
const reactNativeWebEntry = Bun.resolveSync('react-native-web', repositoryRoot);
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');

/*** Exercise ChessBoard's real React Native Web hit targets through Chromium native input. */
async function testChessChromiumAsync() {
  const bundlePath = join(temporaryRoot, 'chess-acceptance.js');
  const build = await Bun.build({
    entrypoints: [join(repositoryRoot, 'test-fixtures/chessChromiumAcceptance.tsx')],
    format: 'esm',
    naming: 'chess-acceptance.js',
    outdir: temporaryRoot,
    plugins: [
      {
        name: 'react-native-web',
        setup(build) {
          build.onResolve({ filter: /^react-native$/ }, () => ({ path: reactNativeWebEntry }));
        },
      },
    ],
    target: 'browser',
  });
  assert(build.success, build.logs.map(({ message }) => message).join('\n'));
  const server = Bun.serve({
    fetch(request) {
      return new URL(request.url).pathname === '/chess-acceptance.js'
        ? new Response(Bun.file(bundlePath))
        : new Response(
            '<!doctype html><meta charset="utf-8"><script type="module" src="/chess-acceptance.js"></script>',
          );
    },
    port: 0,
  });
  const browser = await ChromeSession.createAsync(await dynamicPortAsync());
  try {
    await browser.navigateAsync(`http://127.0.0.1:${server.port}`);
    const initial = await browser.waitForStateAsync((state) => hasRects(state));
    assertRectangles(initial.rects);
    assertOrientation(initial.rects);
    await browser.clickRectAsync(requireRect(initial, 'white-cell-a2'));
    await browser.touchRectAsync(requireRect(initial, 'white-cell-b2'));
    const interacted = await browser.waitForStateAsync(
      (state) => state.events.length === 2 && state.moves.length === 1,
    );
    assert(
      JSON.stringify(interacted.events) === JSON.stringify(['press:1:2', 'press:2:2']),
      `ChessBoard did not emit caller-owned cell intents: ${JSON.stringify(interacted.events)}`,
    );
    assert(
      JSON.stringify(interacted.moves) ===
        JSON.stringify([{ from: { column: 1, row: 2 }, to: { column: 2, row: 2 } }]),
      `ChessBoard did not emit the caller-owned move attempt: ${JSON.stringify(interacted.moves)}`,
    );
    await browser.resizeAsync(420);
    const resized = await browser.waitForStateAsync((state) => {
      const before = initial.rects['white-cell-a2'];
      const after = state.rects['white-cell-a2'];
      return (
        before !== undefined && after !== undefined && after.width > 0 && after.width < before.width
      );
    });
    assertRectangles(resized.rects);
    await browser.clickRectAsync(requireRect(resized, 'black-cell-c1'));
    const responsive = await browser.waitForStateAsync((state) => state.events.length === 3);
    assert(
      responsive.events.at(-1) === 'press:3:1',
      `Resized target did not emit the expected intent: ${JSON.stringify(responsive.events)}`,
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
      'Chromium ChessBoard acceptance passed: rectangular white/black targets, mouse/touch intents, and responsive targets.',
    );
  } finally {
    browser.close();
    server.stop();
  }
}

/*** Confirm every tested native target has a non-zero square rectangle. */
function assertRectangles(rects: Readonly<Record<string, ChessRect>>) {
  for (const [testId, rect] of Object.entries(rects)) {
    assert(
      rect.width > 0 && rect.height > 0 && rect.x > 0 && rect.y > 0,
      `Expected non-zero rectangle for ${testId}: ${JSON.stringify(rect)}`,
    );
    assert(
      Math.abs(rect.width - rect.height) < 0.01,
      `Expected square target for ${testId}: ${JSON.stringify(rect)}`,
    );
  }
}

/*** Confirm opposite orientations place the same coordinate at opposite horizontal edges. */
function assertOrientation(rects: Readonly<Record<string, ChessRect>>) {
  const white = requireRect({ rects } as ChessState, 'white-cell-a2');
  const black = requireRect({ rects } as ChessState, 'black-cell-a2');
  assert(
    white.x < black.x,
    `Expected a2 to reverse horizontally by orientation: ${JSON.stringify({ white, black })}`,
  );
}

/*** Require a target rectangle before native input dispatch. */
function requireRect(state: Pick<ChessState, 'rects'>, testId: string): ChessRect {
  const rect = state.rects[testId];
  assert(rect !== undefined, `Missing rendered target ${testId}.`);
  return rect;
}

/*** Require the initial fixture's test targets to exist. */
function hasRects(state: ChessState) {
  return ['white-cell-a2', 'white-cell-b2', 'black-cell-a2', 'black-cell-c1'].every(
    (testId) => state.rects[testId] !== undefined,
  );
}

/*** Allocate a loopback debugging port without a fixed-port assumption. */
async function dynamicPortAsync(): Promise<number> {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
}

/*** Drive headless Chromium only through its public DevTools Protocol endpoint. */
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
  async resizeAsync(width: number) {
    await this.evaluateAsync(`window.chessAcceptance.resize(${width})`);
  }
  async clickRectAsync(rect: ChessRect) {
    await this.mouseAsync(rect, 'mousePressed');
    await this.mouseAsync(rect, 'mouseReleased');
  }
  async touchRectAsync(rect: ChessRect) {
    const touch = { id: 1, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    await this.sendAsync('Input.dispatchTouchEvent', { touchPoints: [touch], type: 'touchStart' });
    await this.sendAsync('Input.dispatchTouchEvent', { touchPoints: [], type: 'touchEnd' });
  }
  async waitForStateAsync(predicate: (state: ChessState) => boolean): Promise<ChessState> {
    const deadline = Date.now() + 30_000;
    let last: ChessState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<ChessState | null>(
        'window.chessAcceptance?.read() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.evaluateAsync('new Promise((resolve) => requestAnimationFrame(resolve))');
    }
    throw new Error(`Timed out waiting for ChessBoard state: ${JSON.stringify(last)}`);
  }
  close() {
    this.socket.close();
    this.process.kill();
  }
  private async mouseAsync(rect: ChessRect, type: 'mousePressed' | 'mouseReleased') {
    await this.sendAsync('Input.dispatchMouseEvent', {
      type,
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      button: 'left',
      clickCount: 1,
    });
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

/*** Wait for Chromium's loopback debugging endpoint. */
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
  await testChessChromiumAsync();
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
