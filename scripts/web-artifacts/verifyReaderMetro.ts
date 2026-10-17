import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';

export type ReaderVariant = 'direct' | 'materialized';

type JsonObject = Record<string, unknown>;

/*** Verify a live Reader route with explicit Metro lifecycle and browser diagnostics. */
export async function verifyReaderMetroAsync(
  fixtureRoot: string,
  variant: ReaderVariant,
): Promise<void> {
  const port = await reservePortAsync(`Metro ${variant}`);
  const debuggerPort = await reservePortAsync(`Chrome ${variant}`);
  const url = `http://127.0.0.1:${port}/reader`;
  const metroOutput: string[] = [];
  recordReaderDiagnostics(fixtureRoot, variant);
  const metro = Bun.spawn({
    cmd: ['bun', 'x', 'expo', 'start', '--web', '--port', String(port)],
    cwd: fixtureRoot,
    env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1' },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const metroStdout = drainProcessStreamAsync(metro.stdout, `metro:${variant}:stdout`, metroOutput);
  const metroStderr = drainProcessStreamAsync(metro.stderr, `metro:${variant}:stderr`, metroOutput);
  let metroExitCode: number | undefined;
  const metroExited = metro.exited.then((code) => {
    metroExitCode = code;
    console.log(`Metro ${variant} exited with code ${code}.`);
    return code;
  });
  const chromeProfile = mkdtempSync(join(fixtureRoot, '.reader-chrome-'));
  let chrome: ReturnType<typeof Bun.spawn> | undefined;
  const chromeOutput: string[] = [];
  let chromeStreams: readonly Promise<void>[] = [];
  try {
    await waitForMetroResponseAsync(`http://127.0.0.1:${port}/`, () => metroExitCode, 'listener');
    await waitForMetroResponseAsync(url, () => metroExitCode, 'route');
    chrome = Bun.spawn({
      cmd: [
        resolveChromeExecutable(),
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        `--remote-debugging-port=${debuggerPort}`,
        `--user-data-dir=${chromeProfile}`,
        'about:blank',
      ],
      stderr: 'pipe',
      stdout: 'pipe',
    });
    chromeStreams = [
      drainProcessStreamAsync(chrome.stdout, `chrome:${variant}:stdout`, chromeOutput),
      drainProcessStreamAsync(chrome.stderr, `chrome:${variant}:stderr`, chromeOutput),
    ];
    await verifyReaderInChromeAsync(fixtureRoot, url, debuggerPort, variant);
  } finally {
    chrome?.kill();
    if (chrome !== undefined) await chrome.exited;
    await Promise.all(chromeStreams);
    rmChromeProfile(chromeProfile);
    metro.kill();
    await metroExited;
    await Promise.all([metroStdout, metroStderr]);
    const chromeEvidence = processEvidence(`Chrome ${variant}`, chromeOutput);
    const metroEvidence = processEvidence(`Metro ${variant}`, metroOutput);
    console.log(chromeEvidence);
    console.log(metroEvidence);
    writeRetainedDiagnostic(
      fixtureRoot,
      variant,
      'process.log',
      `${chromeEvidence}\n\n${metroEvidence}\n`,
    );
  }
}

/*** Reserve an ephemeral loopback port, then release it immediately before its child process starts. */
async function reservePortAsync(label: string): Promise<number> {
  const server = createServer();
  const port = await new Promise<number>((resolvePort, reject) => {
    server.once('error', reject);
    server.listen({ host: '127.0.0.1', port: 0 }, () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error(`Could not reserve a numeric ${label} port.`));
        return;
      }
      resolvePort(address.port);
    });
  });
  await new Promise<void>((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
  console.log(`Reserved and released ${label} port ${port}.`);
  return port;
}

/*** Continuously drain a child stream so diagnostics cannot block its parent process. */
async function drainProcessStreamAsync(
  stream: number | ReadableStream<Uint8Array> | undefined,
  label: string,
  output: string[],
): Promise<void> {
  if (stream === undefined || typeof stream === 'number') return;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const next = await reader.read();
    if (next.done) return;
    const text = decoder.decode(next.value, { stream: true });
    output.push(text);
    process.stdout.write(`[${label}] ${text}`);
  }
}

/*** Summarize child output in timeout and exit failures without relying on a retained fixture alone. */
function processEvidence(label: string, output: readonly string[]): string {
  return `${label} output:\n${output.join('').slice(-20_000)}`;
}

/*** Poll an HTTP endpoint while detecting a Metro child exit and retaining status/body evidence. */
async function waitForMetroResponseAsync(
  url: string,
  metroExitCode: () => number | undefined,
  stage: 'listener' | 'route',
): Promise<void> {
  const deadline = Date.now() + 90_000;
  let lastEvidence = 'no response received';
  while (Date.now() < deadline) {
    const exitCode = metroExitCode();
    if (exitCode !== undefined) {
      throw new Error(`Metro exited with code ${exitCode} before ${stage} readiness at ${url}.`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      const body = (await response.text()).slice(0, 1_000);
      lastEvidence = `HTTP ${response.status} ${response.statusText}: ${body}`;
      console.log(`Metro ${stage} probe ${url}: ${lastEvidence}`);
      if (stage === 'listener' ? response.status < 500 : response.ok) return;
    } catch (error) {
      lastEvidence = error instanceof Error ? error.message : String(error);
      console.log(`Metro ${stage} probe ${url}: ${lastEvidence}`);
    }
    await Bun.sleep(500);
  }
  throw new Error(
    `Metro did not reach ${stage} readiness at ${url} within 90 seconds: ${lastEvidence}`,
  );
}

/*** Record version, physical-module and Metro configuration evidence for one isolated variant. */
function recordReaderDiagnostics(fixtureRoot: string, variant: ReaderVariant): void {
  const resolveModule = (specifier: string): string => {
    try {
      return Bun.resolveSync(specifier, fixtureRoot);
    } catch (error) {
      return `unresolved: ${error instanceof Error ? error.message : String(error)}`;
    }
  };
  const packageVersion = (packageName: string): string => {
    try {
      const packagePath = join(
        fixtureRoot,
        'node_modules',
        ...packageName.split('/'),
        'package.json',
      );
      const packageJson: unknown = JSON.parse(readFileSync(packagePath, 'utf8'));
      if (!isJsonObject(packageJson) || typeof packageJson.version !== 'string') {
        throw new Error(`Expected ${packageName} package version.`);
      }
      return packageJson.version;
    } catch (error) {
      return `unavailable: ${error instanceof Error ? error.message : String(error)}`;
    }
  };
  const evidence = {
    bun: Bun.version,
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
    variant,
    versions: Object.fromEntries(
      ['expo', 'metro', 'pdfjs-dist', '@ankhorage/reader'].map((name) => [
        name,
        packageVersion(name),
      ]),
    ),
    resolutions: Object.fromEntries(
      ['@ankhorage/reader', 'pdfjs-dist', 'pdfjs-dist/build/pdf.worker.mjs'].map((specifier) => [
        specifier,
        resolveModule(specifier),
      ]),
    ),
    metroConfig: resolveModule('expo/metro-config'),
  };
  const path = join(fixtureRoot, `reader-${variant}-diagnostics.json`);
  const contents = `${JSON.stringify(evidence, null, 2)}\n`;
  writeFileSync(path, contents);
  writeRetainedDiagnostic(fixtureRoot, variant, 'resolver.json', contents);
  console.log(`Reader ${variant} diagnostics:\n${JSON.stringify(evidence, null, 2)}`);
}

/*** Inspect live Chrome DOM and console signals through the native DevTools protocol. */
async function verifyReaderInChromeAsync(
  fixtureRoot: string,
  url: string,
  debuggerPort: number,
  variant: ReaderVariant,
): Promise<void> {
  const target = await waitForChromeTargetAsync(url, debuggerPort);
  const consoleErrors: string[] = [];
  const networkUrls: string[] = [];
  const session = await openChromeSessionAsync(
    target.webSocketDebuggerUrl,
    consoleErrors,
    networkUrls,
  );
  try {
    await session.command('Runtime.enable');
    await session.command('Log.enable');
    await session.command('Network.enable');
    await session.command('Page.enable');
    await session.command('Page.navigate', { url });
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      const result = await session.command('Runtime.evaluate', {
        awaitPromise: true,
        expression: `JSON.stringify({ canvas: document.querySelectorAll('.reader-pdf-page canvas').length, text: [...document.querySelectorAll('.reader-pdf-text-layer span')].map((element) => element.textContent).join(' ') })`,
        returnByValue: true,
      });
      const evaluation = result as {
        readonly result?: { readonly result?: { readonly value?: unknown } };
      };
      const reader = parseReaderRender(evaluation.result?.result?.value);
      if (
        reader !== undefined &&
        reader.canvas > 0 &&
        reader.text.includes('ZORA Reader acceptance')
      ) {
        if (consoleErrors.some((error) => /worker/i.test(error))) {
          throw new Error(`Reader browser logged a worker error:\n${consoleErrors.join('\n')}`);
        }
        const graphUrls = networkUrls.filter((entry) => /bundle|reader|pdfjs|worker/u.test(entry));
        console.log(`Reader ${variant} Metro graph URLs:\n${graphUrls.join('\n')}`);
        return;
      }
      await Bun.sleep(250);
    }
    throw new Error(
      `Reader browser did not render the PDF canvas and text layer. Console errors:\n${consoleErrors.join('\n')}`,
    );
  } finally {
    writeRetainedDiagnostic(
      fixtureRoot,
      variant,
      'browser.json',
      `${JSON.stringify(
        {
          consoleErrors,
          graphUrls: networkUrls.filter((entry) => /bundle|reader|pdfjs|worker/u.test(entry)),
          workerErrors: consoleErrors.filter((error) => /worker/i.test(error)),
        },
        null,
        2,
      )}\n`,
    );
    session.close();
  }
}

/*** Persist bounded, sanitized browser and resolver evidence outside the disposable fixture. */
function writeRetainedDiagnostic(
  fixtureRoot: string,
  variant: ReaderVariant,
  name: string,
  contents: string,
): void {
  const root = process.env.ZORA_EXPO_CANDIDATE_DIAGNOSTICS_DIR;
  if (root === undefined) return;
  const directory = join(root, variant);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, name), sanitizeDiagnostic(contents, fixtureRoot));
}

/*** Remove fixture paths, document payloads, and common credential fields from retained evidence. */
function sanitizeDiagnostic(contents: string, fixtureRoot: string): string {
  return contents
    .replaceAll(fixtureRoot, '<fixture>')
    .replace(/data:application\/pdf;base64,[^"'\s]+/gu, '<pdf-data-uri>')
    .replace(/((?:authorization|cookie|password|token)=)[^&\s]+/giu, '$1<redacted>');
}

/*** Decode the DevTools evaluation result without trusting JSON parser output. */
function parseReaderRender(
  value: unknown,
): { readonly canvas: number; readonly text: string } | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed: unknown = JSON.parse(value);
  if (
    !isJsonObject(parsed) ||
    typeof parsed.canvas !== 'number' ||
    typeof parsed.text !== 'string'
  ) {
    return undefined;
  }
  return { canvas: parsed.canvas, text: parsed.text };
}

/*** Wait for Chrome's DevTools endpoint and create an isolated page for the Reader route. */
async function waitForChromeTargetAsync(
  url: string,
  debuggerPort: number,
): Promise<{ readonly webSocketDebuggerUrl: string }> {
  const endpoint = `http://127.0.0.1:${debuggerPort}/json/new?${encodeURIComponent(url)}`;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(endpoint, { method: 'PUT' });
      if (response.ok) {
        const target: unknown = await response.json();
        if (isJsonObject(target) && typeof target.webSocketDebuggerUrl === 'string') {
          return { webSocketDebuggerUrl: target.webSocketDebuggerUrl };
        }
      }
    } catch {
      // Chrome has not opened the DevTools listener yet.
    }
    await Bun.sleep(250);
  }
  throw new Error('Chrome did not expose a DevTools page within 30 seconds.');
}

/*** Open a minimal DevTools session while retaining browser console, log and network evidence. */
async function openChromeSessionAsync(
  url: string,
  consoleErrors: string[],
  networkUrls: string[],
): Promise<{
  readonly close: () => void;
  readonly command: (method: string, params?: JsonObject) => Promise<JsonObject>;
}> {
  const socket = new WebSocket(url);
  const pending = new Map<
    number,
    { readonly reject: (reason: unknown) => void; readonly resolve: (value: JsonObject) => void }
  >();
  let sequence = 0;
  await new Promise<void>((resolveConnection, reject) => {
    socket.onerror = () => reject(new Error('Could not connect to Chrome DevTools.'));
    socket.onopen = () => resolveConnection();
  });
  socket.onmessage = ({ data }) => {
    const message: unknown = JSON.parse(String(data));
    if (!isJsonObject(message)) return;
    if (typeof message.id === 'number') {
      const request = pending.get(message.id);
      if (request === undefined) return;
      pending.delete(message.id);
      if (message.error !== undefined) request.reject(message.error);
      else request.resolve(message);
      return;
    }
    if (message.method === 'Network.requestWillBeSent') {
      const request = isJsonObject(message.params) ? message.params.request : undefined;
      if (isJsonObject(request) && typeof request.url === 'string') networkUrls.push(request.url);
    }
    const text = JSON.stringify(message);
    if (
      (message.method === 'Runtime.consoleAPICalled' || message.method === 'Log.entryAdded') &&
      /(?:"type":"error"|"level":"error")/u.test(text)
    ) {
      consoleErrors.push(text);
    }
  };
  return {
    close: () => socket.close(),
    command: async (method, params = {}) => {
      const id = ++sequence;
      socket.send(JSON.stringify({ id, method, params }));
      return await new Promise<JsonObject>((resolveRequest, reject) =>
        pending.set(id, { reject, resolve: resolveRequest }),
      );
    },
  };
}

/*** Resolve Chrome from the CI image or the local macOS application bundle. */
function resolveChromeExecutable(): string {
  const candidates = [
    process.env.CHROME_PATH,
    Bun.which('google-chrome'),
    Bun.which('google-chrome-stable'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter((value): value is string => value !== undefined);
  const chrome = candidates.find((candidate) => existsSync(candidate));
  if (chrome === undefined)
    throw new Error('Google Chrome is required for the Expo Reader browser acceptance gate.');
  return chrome;
}

/*** Remove the disposable Chrome profile after Chrome has stopped using it. */
function rmChromeProfile(path: string): void {
  rmSync(path, { force: true, recursive: true });
}

/*** Narrow unknown JSON objects before inspecting DevTools messages and package metadata. */
function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
