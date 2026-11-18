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

/*** Execute real-browser stable-topology acceptance at representative repository counts. */
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
    const initialInteraction = await browser.waitForStableInteractionStateAsync();
    const beforeInteractionMeasurement = requireInteractionMeasurement(initialInteraction);
    assertNarrowViewportFit(initialInteraction);
    const beforeInteractionViewport = requireInteractionViewport(initialInteraction);
    const beforeInteractionLayouts = initialInteraction.layoutCompletions;
    const beforeInteractionSorts = initialInteraction.layoutSorts;
    const source = beforeInteractionMeasurement.nodes.find((node) => node.id === 'src');
    assert(source !== undefined, 'Public measureNodes() did not return src.');
    const dependency = beforeInteractionMeasurement.nodes.find((node) => node.id === 'dependency');
    assert(dependency !== undefined, 'Public measureNodes() did not return dependency.');

    await browser.clickAsync(source.position.x, source.position.y, 1);
    const selected = await browser.waitForInteractionStateAsync(
      (state) =>
        state.selected &&
        state.events.filter((event) => event.id === 'src' && event.type === 'press').length === 1,
    );
    assert(
      selected.layoutCompletions === beforeInteractionLayouts &&
        selected.layoutSorts === beforeInteractionSorts,
      `Selection unexpectedly restarted layout: ${JSON.stringify({
        beforeInteractionLayouts,
        afterInteractionLayouts: selected.layoutCompletions,
        beforeInteractionSorts,
        afterInteractionSorts: selected.layoutSorts,
      })}`,
    );
    assert(
      selected.events.find(isSourcePress)?.selectionIntent === 'replace',
      `Plain native click did not emit replace: ${JSON.stringify(selected.events)}`,
    );
    await browser.clickAsync(dependency.position.x, dependency.position.y, 1, { ctrlKey: true });
    const toggled = await browser.waitForInteractionStateAsync(
      (state) =>
        state.events.filter((event) => event.id === 'dependency' && event.type === 'press')
          .length === 1 &&
        state.selectedNodeIds.includes('src') &&
        state.selectedNodeIds.includes('dependency'),
    );
    assert(
      toggled.domPointerModifiers.some((modifiers) => modifiers.ctrlKey),
      `Chromium did not deliver Ctrl to the DOM pointer event: ${JSON.stringify(toggled.domPointerModifiers)}`,
    );
    assert(
      toggled.events.find(isDependencyPress)?.selectionIntent === 'toggle',
      `Cytoscape tap did not preserve Ctrl selection intent: ${JSON.stringify(toggled.events)}`,
    );
    await browser.clickAsync(source.position.x, source.position.y, 1);
    const replaced = await browser.waitForInteractionStateAsync(
      (state) =>
        state.events.filter((event) => event.id === 'src' && event.type === 'press').length === 2 &&
        state.selectedNodeIds.length === 1 &&
        state.selectedNodeIds[0] === 'src',
    );
    assert(
      replaced.events.filter(isSourcePress).at(-1)?.selectionIntent === 'replace',
      `Unmodified native click did not restore replace intent: ${JSON.stringify(replaced.events)}`,
    );
    await browser.clickAsync(dependency.position.x, dependency.position.y, 1, { metaKey: true });
    const metaToggled = await browser.waitForInteractionStateAsync(
      (state) =>
        state.events.filter((event) => event.id === 'dependency' && event.type === 'press')
          .length === 2 &&
        state.selectedNodeIds.includes('src') &&
        state.selectedNodeIds.includes('dependency'),
    );
    assert(
      metaToggled.domPointerModifiers.some((modifiers) => modifiers.metaKey),
      `Chromium did not deliver Meta to the DOM pointer event: ${JSON.stringify(metaToggled.domPointerModifiers)}`,
    );
    assert(
      metaToggled.events.filter(isDependencyPress).at(-1)?.selectionIntent === 'toggle',
      `Cytoscape tap did not preserve Meta selection intent: ${JSON.stringify(metaToggled.events)}`,
    );
    await browser.clickAsync(source.position.x, source.position.y, 2);
    const afterInteraction = await browser.waitForInteractionStateAsync(
      (state) => state.events.filter(isSourceDoublePress).length === 1,
    );
    assert(
      JSON.stringify(requireInteractionMeasurement(afterInteraction)) ===
        JSON.stringify(beforeInteractionMeasurement),
      `Selection changed public rendered hit geometry: ${JSON.stringify({
        before: beforeInteractionMeasurement,
        after: requireInteractionMeasurement(afterInteraction),
      })}`,
    );
    assert(
      JSON.stringify(requireInteractionViewport(afterInteraction)) ===
        JSON.stringify(beforeInteractionViewport),
      `Selection changed public viewport: ${JSON.stringify({
        before: beforeInteractionViewport,
        after: requireInteractionViewport(afterInteraction),
      })}`,
    );
    await browser.waitForProgressiveScenarioAsync(
      (state) =>
        state.layoutCompletions === 1 &&
        state.readyCount === 1 &&
        state.repositoryIds.length === 5 &&
        state.measurement !== null,
    );
    for (const repositoryCount of [5, 20, 87]) {
      await browser.waitForScenarioAsync(
        repositoryCount,
        (state) => state.measurement !== null && state.repositoryIds.length === repositoryCount,
      );
      await browser.setViewportAsync(repositoryCount, { pan: { x: 40, y: 30 }, zoom: 1.25 });
      const panned = await browser.waitForScenarioAsync(
        repositoryCount,
        (state) => state.viewport?.zoom === 1.25 && state.viewport.pan.x === 40,
      );
      const pannedViewport = requireViewport(panned);
      const before = requireMeasurement(panned);
      const layoutCompletions = panned.layoutCompletions;
      await browser.reselectAsync(repositoryCount);
      const reselected = await browser.waitForScenarioAsync(
        repositoryCount,
        (state) =>
          state.selectionTransitions === 2 && state.selectedRepositoryIds.includes('repository-0'),
      );
      assert(
        JSON.stringify(requireMeasurement(reselected)) === JSON.stringify(before),
        `Rapid deselect/reselect moved repositories at ${repositoryCount}.`,
      );
      assert(
        reselected.layoutCompletions === layoutCompletions,
        `Rapid deselect/reselect reran ELK at ${repositoryCount}.`,
      );
      await browser.removeAsync(repositoryCount);
      const removed = await browser.waitForScenarioAsync(
        repositoryCount,
        (state) => state.repositoryIds.length === repositoryCount - 1,
      );
      assert(
        JSON.stringify(requireMeasurement(removed).nodes) ===
          JSON.stringify(before.nodes.slice(0, -1)),
        `Removal moved retained repositories at ${repositoryCount}: ${JSON.stringify(removed)}`,
      );
      assert(
        JSON.stringify(requireViewport(removed)) === JSON.stringify(pannedViewport),
        `Removal changed viewport at ${repositoryCount}.`,
      );
      assert(
        removed.layoutCompletions === layoutCompletions,
        `Removal reran ELK at ${repositoryCount}.`,
      );
      assert(
        removed.controllerChanges === 0,
        `Removal replaced the controller at ${repositoryCount}.`,
      );
      assert(
        removed.selectedRepositoryIds.includes('repository-0'),
        `Removal lost retained selection at ${repositoryCount}.`,
      );
      await browser.restoreAsync(repositoryCount);
      await browser.removeAsync(repositoryCount);
      await browser.waitForScenarioAsync(
        repositoryCount,
        (state) => state.repositoryIds.length === repositoryCount - 1,
      );
      await browser.fitAsync(repositoryCount);
      const fitted = await browser.waitForScenarioAsync(
        repositoryCount,
        (state) => JSON.stringify(state.viewport) !== JSON.stringify(pannedViewport),
      );
      assert(
        fitted.controllerChanges === 0,
        `Explicit fit replaced the controller at ${repositoryCount}.`,
      );
    }
    assert(
      browser.exceptions.length === 0,
      `Chromium exceptions: ${browser.exceptions.join('\n')}`,
    );
    assert(
      browser.consoleErrors.length === 0,
      `Chromium console errors: ${browser.consoleErrors.join('\n')}`,
    );
    console.log(
      `Chromium GraphView acceptance passed: src double-press once; layout sorts ${beforeInteractionSorts}; measurement and viewport unchanged; narrow ELK fit and 0→1→5 plus 5/20/87 topology suites passed.`,
    );
  } finally {
    browser.close();
    server.stop();
  }
}

/*** Distinguish the required public src double-press from unrelated graph events. */
function isSourceDoublePress(event: { readonly id: string; readonly type: string }) {
  return event.id === 'src' && event.type === 'double-press';
}

/*** Distinguish the required public src press from unrelated graph events. */
function isSourcePress(event: { readonly id: string; readonly type: string }) {
  return event.id === 'src' && event.type === 'press';
}

/*** Distinguish the required public dependency press from unrelated graph events. */
function isDependencyPress(event: { readonly id: string; readonly type: string }) {
  return event.id === 'dependency' && event.type === 'press';
}

/*** Allocate a loopback port without making a fixed-port test assumption. */
async function dynamicPortAsync(): Promise<number> {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
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

/*** Require the stable public rendered-node measurement used for native input coordinates. */
function requireInteractionMeasurement(state: InteractionAcceptanceState): GraphMeasurement {
  assert(state.measurement !== null, 'Public measureNodes() returned null.');
  return state.measurement;
}

/*** Require the stable public viewport before comparing the selection presentation update. */
function requireInteractionViewport(state: InteractionAcceptanceState): GraphViewport {
  assert(state.viewport !== null, 'Public getViewport() returned null.');
  return state.viewport;
}

/*** Prove native fit keeps every ELK node inside a canvas narrower than the configured padding. */
function assertNarrowViewportFit(state: InteractionAcceptanceState): void {
  const measurement = state.narrowMeasurement;
  assert(measurement !== null, 'Narrow GraphView measureNodes() returned null.');
  assert(measurement.nodes.length === 5, 'Narrow GraphView did not render every ELK node.');
  for (const node of measurement.nodes) {
    const bounds = {
      x1: node.position.x - node.size.width / 2,
      x2: node.position.x + node.size.width / 2,
      y1: node.position.y - node.size.height / 2,
      y2: node.position.y + node.size.height / 2,
    };
    assert(
      bounds.x1 >= 0 &&
        bounds.x2 <= measurement.viewport.width &&
        bounds.y1 >= 0 &&
        bounds.y2 <= measurement.viewport.height,
      `Narrow GraphView fit clipped ${node.id}: ${JSON.stringify({ bounds, viewport: measurement.viewport })}`,
    );
  }
}

interface GraphAcceptanceState {
  readonly controllerChanges: number;
  readonly layoutCompletions: number;
  readonly measurement: GraphMeasurement | null;
  readonly repositoryIds: readonly string[];
  readonly selectedRepositoryIds: readonly string[];
  readonly selectionTransitions: number;
  readonly viewport: GraphViewport | null;
}

interface InteractionAcceptanceState {
  readonly domPointerModifiers: readonly { readonly ctrlKey: boolean; readonly metaKey: boolean }[];
  readonly events: readonly {
    readonly id: string;
    readonly selectionIntent?: string;
    readonly type: string;
  }[];
  readonly layoutCompletions: number;
  readonly layoutSorts: number;
  readonly measurement: GraphMeasurement | null;
  readonly narrowMeasurement: GraphMeasurement | null;
  readonly readyCount: number;
  readonly selected: boolean;
  readonly selectedNodeIds: readonly string[];
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

interface ProgressiveGraphAcceptanceState {
  readonly layoutCompletions: number;
  readonly measurement: GraphMeasurement | null;
  readonly readyCount: number;
  readonly repositoryIds: readonly string[];
}

/*** Compare only lifecycle and public canvas state that must settle before native input. */
function isStableInteractionState(
  previous: InteractionAcceptanceState,
  next: InteractionAcceptanceState,
): boolean {
  return (
    previous.readyCount === next.readyCount &&
    previous.layoutCompletions === next.layoutCompletions &&
    previous.layoutSorts === next.layoutSorts &&
    JSON.stringify(previous.measurement) === JSON.stringify(next.measurement) &&
    JSON.stringify(previous.narrowMeasurement) === JSON.stringify(next.narrowMeasurement) &&
    JSON.stringify(previous.viewport) === JSON.stringify(next.viewport)
  );
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

  async clickAsync(
    x: number,
    y: number,
    clickCount: number,
    modifiers: { readonly ctrlKey?: boolean; readonly metaKey?: boolean } = {},
  ): Promise<void> {
    const modifier =
      modifiers.ctrlKey === true ? 'Control' : modifiers.metaKey === true ? 'Meta' : null;
    if (modifier !== null) await this.setModifierAsync(modifier, true);
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x,
      y,
      button: 'left',
      buttons: 1,
      clickCount,
    });
    await this.sendAsync('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x,
      y,
      button: 'left',
      buttons: 0,
      clickCount,
    });
    if (modifier !== null) await this.setModifierAsync(modifier, false);
  }

  private async setModifierAsync(modifier: 'Control' | 'Meta', pressed: boolean): Promise<void> {
    const isControl = modifier === 'Control';
    await this.sendAsync('Input.dispatchKeyEvent', {
      type: pressed ? 'rawKeyDown' : 'keyUp',
      code: isControl ? 'ControlLeft' : 'MetaLeft',
      key: modifier,
      nativeVirtualKeyCode: isControl ? 17 : 91,
      windowsVirtualKeyCode: isControl ? 17 : 91,
    });
  }

  async waitForInteractionStateAsync(
    predicate: (state: InteractionAcceptanceState) => boolean,
  ): Promise<InteractionAcceptanceState> {
    const deadline = Date.now() + 30_000;
    let last: InteractionAcceptanceState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<InteractionAcceptanceState>(
        'window.graphAcceptance?.readInteraction() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.nextAnimationFrameAsync();
    }
    throw new Error(
      `Timed out waiting for a stable native-input GraphView state: ${JSON.stringify(last)}`,
    );
  }

  /*** Wait for lifecycle completion and stable public geometry across browser animation frames. */
  async waitForStableInteractionStateAsync(): Promise<InteractionAcceptanceState> {
    const initial = await this.waitForInteractionStateAsync(
      (state) =>
        state.readyCount === 1 &&
        state.layoutCompletions > 0 &&
        state.measurement !== null &&
        state.narrowMeasurement !== null &&
        state.viewport !== null,
    );
    await this.nextAnimationFrameAsync();
    const settled = await this.readInteractionStateAsync();
    await this.nextAnimationFrameAsync();
    const stable = await this.readInteractionStateAsync();
    assert(
      isStableInteractionState(initial, settled) && isStableInteractionState(settled, stable),
      `Initial public GraphView state changed after lifecycle completion: ${JSON.stringify({ initial, settled, stable })}`,
    );
    return stable;
  }

  async waitForScenarioAsync(
    repositoryCount: number,
    predicate: (state: GraphAcceptanceState) => boolean,
  ): Promise<GraphAcceptanceState> {
    const deadline = Date.now() + 30_000;
    let last: GraphAcceptanceState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<GraphAcceptanceState>(
        `window.graphAcceptance?.read(${repositoryCount}) ?? null`,
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.nextAnimationFrameAsync();
    }
    throw new Error(
      `Timed out waiting for a stable public GraphView state: ${JSON.stringify(last)}`,
    );
  }

  /*** Wait for the public progressive-initial-layout regression state. */
  async waitForProgressiveScenarioAsync(
    predicate: (state: ProgressiveGraphAcceptanceState) => boolean,
  ): Promise<ProgressiveGraphAcceptanceState> {
    const deadline = Date.now() + 30_000;
    let last: ProgressiveGraphAcceptanceState | null = null;
    while (Date.now() < deadline) {
      const state = await this.evaluateAsync<ProgressiveGraphAcceptanceState>(
        'window.graphAcceptance?.readProgressive() ?? null',
      );
      last = state;
      if (state !== null && predicate(state)) return state;
      await this.nextAnimationFrameAsync();
    }
    throw new Error(
      `Timed out waiting for progressive initial GraphView layout: ${JSON.stringify(last)}`,
    );
  }

  /*** Change viewport only through the public GraphViewController supplied by browser lifecycle. */
  async setViewportAsync(repositoryCount: number, viewport: GraphViewport): Promise<void> {
    await this.evaluateAsync(
      `window.graphAcceptance?.setViewport(${repositoryCount}, ${JSON.stringify(viewport)}) ?? false`,
    );
  }

  async removeAsync(repositoryCount: number): Promise<void> {
    await this.evaluateAsync(`window.graphAcceptance?.remove(${repositoryCount}) ?? false`);
  }

  async restoreAsync(repositoryCount: number): Promise<void> {
    await this.evaluateAsync(`window.graphAcceptance?.restore(${repositoryCount}) ?? false`);
  }

  async reselectAsync(repositoryCount: number): Promise<void> {
    await this.evaluateAsync(`window.graphAcceptance?.reselect(${repositoryCount}) ?? false`);
  }

  async fitAsync(repositoryCount: number): Promise<void> {
    await this.evaluateAsync(`window.graphAcceptance?.fit(${repositoryCount}) ?? false`);
  }

  close(): void {
    this.socket.close();
    this.process.kill();
  }

  private async nextAnimationFrameAsync(): Promise<void> {
    await this.evaluateAsync(
      'new Promise((resolve) => requestAnimationFrame(() => resolve(true)))',
    );
  }

  private async readInteractionStateAsync(): Promise<InteractionAcceptanceState> {
    const state = await this.evaluateAsync<InteractionAcceptanceState | null>(
      'window.graphAcceptance?.readInteraction() ?? null',
    );
    assert(state !== null, 'GraphView native-input acceptance fixture is unavailable.');
    return state;
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
