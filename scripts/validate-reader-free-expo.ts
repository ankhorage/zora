import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

type JsonObject = Record<string, unknown>;
type Variant = 'root-baseline' | 'reader-free' | 'reader-control';
type BundleProbe = {
  readonly body: string;
  readonly response: Response;
  readonly observations: readonly string[];
};
type ChromeProtocolMessage = {
  readonly error?: unknown;
  readonly id?: number;
  readonly method?: string;
  readonly params?: unknown;
  readonly result?: unknown;
};
type NetworkResponse = {
  readonly requestId: string;
  readonly status: number;
  readonly url: string;
};

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(process.env.RUNNER_TEMP ?? tmpdir(), 'zora-reader-free-'));
const packageRoot = join(temporaryRoot, 'package');
const artifactsRoot = join(temporaryRoot, 'artifacts');
const bunCacheRoot = join(temporaryRoot, 'bun-cache');
const expoHome = join(temporaryRoot, 'expo-home');
const chromiumCommand =
  process.env.CHROME_BIN ??
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'google-chrome');
const BROWSER_READY_TIMEOUT_MS = 30_000;
const BROWSER_RENDER_TIMEOUT_MS = 90_000;

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function readJson(path: string): JsonObject {
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));
  assert(
    typeof value === 'object' && value !== null && !Array.isArray(value),
    `${path} is not JSON object.`,
  );
  return value as JsonObject;
}

function object(value: unknown, label: string): JsonObject {
  assert(
    typeof value === 'object' && value !== null && !Array.isArray(value),
    `${label} is not an object.`,
  );
  return value as JsonObject;
}

function run(
  command: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {},
): void {
  console.log(`\n> (${cwd}) ${command.join(' ')}`);
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: {
      ...process.env,
      BUN_INSTALL_CACHE_DIR: bunCacheRoot,
      CI: '1',
      EXPO_HOME: expoHome,
      EXPO_NO_TELEMETRY: '1',
      TMPDIR: temporaryRoot,
      ...environment,
    },
    stderr: 'inherit',
    stdout: 'inherit',
  });
  assert(result.exitCode === 0, `Command failed: ${command.join(' ')}`);
}

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function writeFixture(
  root: string,
  candidatePath: string,
  variant: Variant,
  navigation: boolean,
): void {
  mkdirSync(join(root, 'app'), { recursive: true });
  const sourcePackage = readJson(
    join(repositoryRoot, 'examples/social_community/community-feed/package.json'),
  );
  const dependencies = object(sourcePackage.dependencies, 'example dependencies');
  dependencies['@ankhorage/zora'] = `file:${candidatePath}`;
  assert(dependencies['@ankhorage/reader'] === undefined, 'Fixture manifest must not add Reader.');
  writeFileSync(
    join(root, 'package.json'),
    `${JSON.stringify(
      {
        ...sourcePackage,
        name: `zora-reader-free-${variant}-${navigation ? 'navigation' : 'social-web'}`,
        dependencies,
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(root, 'app.json'),
    JSON.stringify(
      {
        expo: {
          name: 'Reader-free',
          slug: `reader-free-${variant}-${navigation ? 'nav' : 'social'}`,
          web: { bundler: 'metro' },
        },
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(root, 'tsconfig.json'),
    JSON.stringify(
      {
        extends: 'expo/tsconfig.base',
        compilerOptions: { strict: true },
        include: ['app/**/*.tsx', 'expo-env.d.ts'],
      },
      null,
      2,
    ),
  );
  writeFileSync(join(root, 'expo-env.d.ts'), '/// <reference types="expo/types" />\n');

  const zoraImport =
    variant === 'reader-free'
      ? "import { AppShell, ZoraProvider, useZoraTheme, ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META } from '@ankhorage/zora/reader-free';\nimport { ZORA_BASE_COMPONENT_REGISTRY } from '@ankhorage/zora/registry';"
      : 'import { AppShell, ZoraProvider, useZoraTheme, ZORA_COMPONENT_META, ZORA_THEME_RECIPE_META, ZORA_COMPONENT_REGISTRY' +
        (variant === 'reader-control' ? ', Reader' : '') +
        " } from '@ankhorage/zora';";
  const registry =
    variant === 'reader-free'
      ? 'const registry = ZORA_BASE_COMPONENT_REGISTRY;'
      : 'const registry = ZORA_COMPONENT_REGISTRY;';
  const reader = variant === 'reader-control' ? '<Reader format="epub" />' : '';
  const links = navigation
    ? '<RuntimeText>Navigation configuration</RuntimeText><RuntimeText>Social Web configuration</RuntimeText>'
    : '<RuntimeText>Social Web configuration</RuntimeText>';
  writeFileSync(
    join(root, 'app', '_layout.tsx'),
    `${zoraImport}
import { Stack } from 'expo-router';

function RootContent() {
  const { mode } = useZoraTheme();
  ${registry}
  const RuntimeCard = registry.Card;
  const RuntimeText = registry.Text;
  const metadataCount = Object.keys(ZORA_COMPONENT_META).length + Object.keys(ZORA_THEME_RECIPE_META).length;
  return <AppShell><RuntimeCard><RuntimeText>Reader-free runtime acceptance</RuntimeText><RuntimeText>{mode}</RuntimeText><RuntimeText>{metadataCount}</RuntimeText>${links}${reader}</RuntimeCard></AppShell>;
}

export default function RootLayout() {
  return <ZoraProvider><RootContent />${navigation ? '<Stack screenOptions={{ headerShown: false }} />' : ''}</ZoraProvider>;
}
`,
  );
  writeFileSync(
    join(root, 'app', 'index.tsx'),
    'export default function Index() { return null; }\n',
  );
}

async function dynamicPortAsync(): Promise<number> {
  const server = Bun.serve({ fetch: () => new Response(''), port: 0 });
  const port = server.port;
  server.stop();
  assert(port !== undefined, 'Bun did not allocate a TCP port.');
  return port;
}

async function waitForBundleAsync(
  url: string,
  process: ReturnType<typeof Bun.spawn>,
  logs: string[],
): Promise<BundleProbe> {
  const deadline = Date.now() + 90_000;
  const observations: string[] = [];
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      const body = await response.text();
      observations.push(
        `${response.status} ${response.statusText}; ${response.url}; ${body.slice(0, 500)}`,
      );
      if (response.status === 200 || response.status === 500)
        return { response, body, observations };
    } catch (error) {
      observations.push(`request error: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (process.exitCode !== null) break;
    await Bun.sleep(500);
  }
  const reason = process.exitCode === null ? 'timeout' : `process crash (exit ${process.exitCode})`;
  throw new Error(
    `Metro ${reason} before a terminal bundle response for ${url}.\n${observations.join('\n')}\n${logs.join('')}`,
  );
}

async function readStreamAsync(
  stream: ReadableStream<Uint8Array> | null,
  logs: string[],
): Promise<void> {
  if (!stream) return;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const next = await reader.read();
    if (next.done) return;
    logs.push(decoder.decode(next.value, { stream: true }));
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseChromeProtocolMessage(data: unknown): ChromeProtocolMessage | null {
  const source =
    typeof data === 'string'
      ? data
      : data instanceof ArrayBuffer
        ? Buffer.from(data).toString()
        : '';
  if (!source) return null;
  const parsed = JSON.parse(source) as unknown;
  if (!isRecord(parsed)) return null;
  return {
    ...(typeof parsed.id === 'number' ? { id: parsed.id } : {}),
    ...(typeof parsed.method === 'string' ? { method: parsed.method } : {}),
    ...('params' in parsed ? { params: parsed.params } : {}),
    ...('result' in parsed ? { result: parsed.result } : {}),
    ...('error' in parsed ? { error: parsed.error } : {}),
  };
}

async function waitForHttpAsync(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Chrome may still be starting its debugging endpoint.
    }
    await Bun.sleep(100);
  }
  throw new Error(`Timed out waiting for Chrome at ${url}.`);
}

class ChromeSession {
  readonly consoleErrors: string[] = [];
  readonly exceptions: string[] = [];
  readonly failedRequests: string[] = [];
  readonly responses: NetworkResponse[] = [];
  private nextId = 1;
  private readonly pending = new Map<
    number,
    { reject: (error: Error) => void; resolve: (value: unknown) => void }
  >();

  private constructor(
    private readonly process: ReturnType<typeof Bun.spawn>,
    private readonly socket: WebSocket,
  ) {
    this.socket.onmessage = (event) => this.handleMessage(event.data);
  }

  static async createAsync(debugPort: number, profileDirectory: string): Promise<ChromeSession> {
    mkdirSync(profileDirectory, { recursive: true });
    const process = Bun.spawn(
      [
        chromiumCommand,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--remote-debugging-address=127.0.0.1',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profileDirectory}`,
        'about:blank',
      ],
      { stderr: 'pipe', stdout: 'pipe' },
    );
    try {
      await waitForHttpAsync(
        `http://127.0.0.1:${debugPort}/json/version`,
        BROWSER_READY_TIMEOUT_MS,
      );
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
        ['Page.enable', 'Runtime.enable', 'Log.enable', 'Network.enable'].map((method) =>
          session.sendAsync(method),
        ),
      );
      return session;
    } catch (error) {
      process.kill();
      throw error;
    }
  }

  async navigateAsync(url: string): Promise<void> {
    await this.sendAsync('Page.navigate', { url });
    await this.waitForDocumentAsync();
  }

  async waitForTextAsync(expectedText: string): Promise<string> {
    const deadline = Date.now() + BROWSER_RENDER_TIMEOUT_MS;
    let text = '';
    while (Date.now() < deadline) {
      text = await this.evaluateAsync<string>('document.body?.innerText ?? ""');
      if (text.includes(expectedText)) return text;
      await Bun.sleep(250);
    }
    throw new Error(
      `Timed out waiting for browser text ${JSON.stringify(expectedText)}. Last text: ${text.slice(-4_000)}`,
    );
  }

  async readBundleAsync(): Promise<{ readonly body: string; readonly response: NetworkResponse }> {
    const response = this.responses.find((candidate) =>
      candidate.url.includes('/node_modules/expo-router/entry.bundle'),
    );
    assert(
      response !== undefined,
      `Chrome did not request an Expo Router entry bundle. Responses: ${JSON.stringify(this.responses)}`,
    );
    assert(
      response.status === 200,
      `Chrome entry bundle returned HTTP ${response.status}: ${response.url}`,
    );
    const result = await this.sendAsync('Network.getResponseBody', {
      requestId: response.requestId,
    });
    assert(
      isRecord(result) && typeof result.body === 'string',
      'Chrome could not read the actual entry bundle body.',
    );
    return { body: result.body, response };
  }

  close(): void {
    this.socket.close();
    this.process.kill();
  }

  private async evaluateAsync<T>(expression: string): Promise<T> {
    const result = await this.sendAsync('Runtime.evaluate', { expression, returnByValue: true });
    assert(
      isRecord(result) && isRecord(result.result) && 'value' in result.result,
      `Chrome evaluation returned no value for ${expression}.`,
    );
    return result.result.value as T;
  }

  private async waitForDocumentAsync(): Promise<void> {
    const deadline = Date.now() + BROWSER_READY_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if ((await this.evaluateAsync<string>('document.readyState')) !== 'loading') return;
      await Bun.sleep(100);
    }
    throw new Error('Timed out waiting for Chrome document readiness.');
  }

  private handleMessage(data: unknown): void {
    const message = parseChromeProtocolMessage(data);
    if (!message) return;
    if (message.id !== undefined) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result);
      return;
    }
    const params = isRecord(message.params) ? message.params : {};
    if (
      message.method === 'Network.responseReceived' &&
      isRecord(params.response) &&
      typeof params.requestId === 'string' &&
      typeof params.response.status === 'number' &&
      typeof params.response.url === 'string'
    ) {
      this.responses.push({
        requestId: params.requestId,
        status: params.response.status,
        url: params.response.url,
      });
    }
    if (message.method === 'Network.loadingFailed' && typeof params.errorText === 'string')
      this.failedRequests.push(params.errorText);
    if (message.method === 'Runtime.exceptionThrown')
      this.exceptions.push(JSON.stringify(params.exceptionDetails));
    if (
      message.method === 'Log.entryAdded' &&
      isRecord(params.entry) &&
      params.entry.level === 'error'
    )
      this.consoleErrors.push(String(params.entry.text ?? 'unknown Log error'));
    if (message.method === 'Runtime.consoleAPICalled' && params.type === 'error')
      this.consoleErrors.push(JSON.stringify(params.args ?? []));
  }

  private sendAsync(method: string, params?: Readonly<Record<string, unknown>>): Promise<unknown> {
    const id = this.nextId++;
    const response = new Promise<unknown>((resolve, reject) =>
      this.pending.set(id, { reject, resolve }),
    );
    this.socket.send(JSON.stringify(params ? { id, method, params } : { id, method }));
    return response;
  }
}

function sanitizedLog(log: string): string {
  return log.replaceAll(temporaryRoot, '<fixture>').replaceAll(repositoryRoot, '<repository>');
}

async function verifyLiveVariantAsync(
  root: string,
  variant: Variant,
  label: string,
): Promise<void> {
  const port = await dynamicPortAsync();
  const logs: string[] = [];
  const metroProcess = Bun.spawn(
    ['bun', 'x', 'expo', 'start', '--localhost', '--port', `${port}`],
    {
      cwd: root,
      env: {
        ...process.env,
        BUN_INSTALL_CACHE_DIR: bunCacheRoot,
        // CI is Expo's supported noninteractive mode. Browser rendering is owned independently below.
        CI: '1',
        EXPO_HOME: expoHome,
        EXPO_NO_TELEMETRY: '1',
        TMPDIR: temporaryRoot,
      },
      stderr: 'pipe',
      stdout: 'pipe',
    },
  );
  const output = Promise.all([
    readStreamAsync(metroProcess.stdout, logs),
    readStreamAsync(metroProcess.stderr, logs),
  ]);
  const rootUrl = `http://localhost:${port}`;
  const bundleUrl = `${rootUrl}/node_modules/expo-router/entry.bundle?platform=web&dev=true&minify=false`;
  try {
    const {
      body: source,
      observations,
      response,
    } = await waitForBundleAsync(bundleUrl, metroProcess, logs);
    const hasPdfWorker = /pdfjs-dist|pdf\.worker|@ankhorage\/reader/u.test(source);
    const evidence = [
      `request URL: ${bundleUrl}`,
      `response: ${response.status} ${response.statusText}; ${response.url}`,
      `observations:\n${observations.join('\n')}`,
      `PDF/Reader graph: ${hasPdfWorker ? 'reachable' : 'absent'}`,
    ].join('\n');
    logs.push(`${evidence}\n`);
    if (variant === 'reader-free') {
      assert(
        response.status === 200,
        `${label} Reader-free Metro bundle returned HTTP ${response.status}.\n${evidence}`,
      );
      assert(
        !hasPdfWorker,
        `${label} Reader-free Metro bundle reaches the PDF worker graph.\n${evidence}`,
      );
      const debugPort = await dynamicPortAsync();
      const browser = await ChromeSession.createAsync(
        debugPort,
        join(temporaryRoot, 'chrome-profiles', `${label}-${debugPort}`),
      );
      try {
        await browser.navigateAsync(rootUrl);
        const renderedText = await browser.waitForTextAsync('Reader-free runtime acceptance');
        const actualBundle = await browser.readBundleAsync();
        const actualBundleHasPdfWorker = /pdfjs-dist|pdf\.worker|@ankhorage\/reader/u.test(
          actualBundle.body,
        );
        const browserEvidence = [
          `rendered text: ${renderedText.slice(0, 1_000)}`,
          `actual entry bundle: ${actualBundle.response.status} ${actualBundle.response.url}`,
          `actual entry PDF/Reader graph: ${actualBundleHasPdfWorker ? 'reachable' : 'absent'}`,
          `browser exceptions: ${JSON.stringify(browser.exceptions)}`,
          `browser console errors: ${JSON.stringify(browser.consoleErrors)}`,
          `failed network requests: ${JSON.stringify(browser.failedRequests)}`,
        ].join('\n');
        logs.push(`browser CDP evidence:\n${browserEvidence}\n`);
        console.log(`${label}: browser CDP evidence:\n${sanitizedLog(browserEvidence)}`);
        assert(
          !actualBundleHasPdfWorker,
          `${label} actual browser entry bundle reaches the PDF worker graph.\n${browserEvidence}`,
        );
        assert(
          browser.exceptions.length === 0,
          `${label} browser threw a runtime exception.\n${browserEvidence}`,
        );
        assert(
          browser.consoleErrors.length === 0,
          `${label} browser emitted console errors.\n${browserEvidence}`,
        );
        assert(
          browser.failedRequests.length === 0,
          `${label} browser failed network requests.\n${browserEvidence}`,
        );
      } finally {
        browser.close();
      }
    } else {
      assert(
        hasPdfWorker || /pdfjs-dist|pdf\.worker/u.test(logs.join('')),
        `${label} control no longer reaches the expected Reader/PDF graph.\n${evidence}`,
      );
    }
    assert(
      !logs.join('').includes('Worker chunk not found') || variant !== 'reader-free',
      `${label} Metro reached the PDF worker.`,
    );
    console.log(
      `${label}: Metro ${response.status}; PDF graph ${hasPdfWorker ? 'reachable' : 'absent'}.`,
    );
  } finally {
    metroProcess.kill();
    await output;
    writeFileSync(join(artifactsRoot, `${label}.log`), sanitizedLog(logs.join('')));
  }
}

let completed = false;
try {
  mkdirSync(packageRoot, { recursive: true });
  mkdirSync(artifactsRoot, { recursive: true });
  mkdirSync(bunCacheRoot, { recursive: true });
  mkdirSync(expoHome, { recursive: true });
  run(['bun', 'run', 'build'], repositoryRoot);
  run(['npm', 'pack', '--silent', '--pack-destination', packageRoot], repositoryRoot, {
    npm_config_cache: join(temporaryRoot, 'npm-cache'),
  });
  const tarballs = readdirSync(packageRoot).filter((name) => name.endsWith('.tgz'));
  assert(tarballs.length === 1, 'Expected exactly one packed ZORA artifact.');
  const candidatePath = join(packageRoot, tarballs[0]!);
  const integrity = sha256(candidatePath);
  const candidateManifest = readJson(join(repositoryRoot, 'package.json'));
  const candidateVersion = candidateManifest.version;
  assert(typeof candidateVersion === 'string', 'Candidate package version is missing.');
  writeFileSync(
    join(artifactsRoot, 'identity.log'),
    `source commit: ${process.env.GITHUB_SHA ?? 'local working tree'}\npackage version: ${candidateVersion}\npackage spec: file:${candidatePath}\ntarball SHA-256: ${integrity}\n`,
  );
  console.log(
    `Packed candidate ${basename(candidatePath)} ${candidateVersion} SHA-256 ${integrity}`,
  );

  for (const [variant, navigation] of [
    ['root-baseline', false],
    ['reader-free', false],
    ['reader-free', true],
    ['reader-control', true],
  ] as const) {
    const label = `${variant}-${navigation ? 'navigation' : 'social-web'}`;
    const root = join(temporaryRoot, label);
    writeFixture(root, candidatePath, variant, navigation);
    run(['bun', 'install'], root);
    rmSync(join(root, 'node_modules'), { force: true, recursive: true });
    run(['bun', 'install', '--frozen-lockfile'], root);
    const installedCandidate = readJson(
      join(root, 'node_modules', '@ankhorage', 'zora', 'package.json'),
    );
    assert(
      installedCandidate.version === candidateVersion,
      `${label} resolved unexpected ZORA package version ${String(installedCandidate.version)}.`,
    );
    console.log(
      `${label}: resolved @ankhorage/zora@${installedCandidate.version} from file:${candidatePath}.`,
    );
    run(['bun', 'x', 'tsc', '--noEmit'], root);
    if (variant === 'reader-free')
      run(
        [
          'bun',
          'x',
          'expo',
          'export',
          '--platform',
          'web',
          '--output-dir',
          join(root, 'web-dist'),
          '--clear',
        ],
        root,
      );
    await verifyLiveVariantAsync(root, variant, label);
  }
  completed = true;
} finally {
  if (completed) rmSync(temporaryRoot, { force: true, recursive: true });
  else console.error(`Reader-free diagnostics retained at ${temporaryRoot}`);
}
