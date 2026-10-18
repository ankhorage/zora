import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

type JsonObject = Record<string, unknown>;
type Variant = 'root-baseline' | 'reader-free' | 'reader-control';

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
      ? "import { AppShell, Card, Text, ZoraProvider, useZoraTheme } from '@ankhorage/zora/reader-free';\nimport { ZORA_BASE_COMPONENT_REGISTRY } from '@ankhorage/zora/registry';"
      : 'import { AppShell, Card, Text, ZoraProvider, useZoraTheme' +
        (variant === 'reader-control' ? ', Reader' : '') +
        " } from '@ankhorage/zora';";
  const registry =
    variant === 'reader-free'
      ? "const registry = ZORA_BASE_COMPONENT_REGISTRY;\n  if ('Reader' in registry) throw new Error('Reader reached the reader-free registry.');"
      : 'const registry = {};';
  const reader = variant === 'reader-control' ? '<Reader format="epub" />' : '';
  const links = navigation
    ? '<Text>Navigation configuration</Text><Text>Social Web configuration</Text>'
    : '<Text>Social Web configuration</Text>';
  writeFileSync(
    join(root, 'app', '_layout.tsx'),
    `${zoraImport}
import { Stack } from 'expo-router';

function RootContent() {
  const { mode } = useZoraTheme();
  ${registry}
  return <AppShell><Card><Text>Reader-free runtime acceptance</Text><Text>{mode}</Text>${links}${reader}</Card></AppShell>;
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
  return port;
}

async function waitForBundleAsync(
  url: string,
  process: ReturnType<typeof Bun.spawn>,
  logs: string[],
): Promise<Response> {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.status === 200 || response.status === 500) return response;
    } catch {
      // Metro is still starting.
    }
    if (process.exitCode !== null) break;
    await Bun.sleep(500);
  }
  throw new Error(`Metro did not serve HTTP 200 for ${url}.\n${logs.join('')}`);
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
  const { CI: _ci, ...metroEnvironment } = process.env;
  const metroProcess = Bun.spawn(
    ['bun', 'x', 'expo', 'start', '--localhost', '--port', `${port}`, '--no-dev', '--minify'],
    {
      cwd: root,
      env: {
        ...metroEnvironment,
        BUN_INSTALL_CACHE_DIR: bunCacheRoot,
        // Expo starts an unrelated React Native DevTools Chromium process when CI is set.
        // The acceptance owns its browser explicitly below, so Metro must stay headless here.
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
  const rootUrl = `http://127.0.0.1:${port}`;
  const bundleUrl = `${rootUrl}/index.bundle?platform=web&dev=false&minify=true`;
  try {
    const bundle = await waitForBundleAsync(bundleUrl, metroProcess, logs);
    const source = await bundle.text();
    const hasPdfWorker = /pdfjs-dist|pdf\.worker|@ankhorage\/reader/u.test(source);
    if (variant === 'reader-free') {
      assert(
        bundle.status === 200,
        `${label} Reader-free Metro bundle returned HTTP ${bundle.status}.`,
      );
      assert(!hasPdfWorker, `${label} Reader-free Metro bundle reaches the PDF worker graph.`);
      const chrome = Bun.spawnSync(
        [
          chromiumCommand,
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--enable-logging=stderr',
          '--dump-dom',
          rootUrl,
        ],
        { cwd: root, stderr: 'pipe', stdout: 'pipe' },
      );
      const browserOutput = `${chrome.stdout.toString()}\n${chrome.stderr.toString()}`;
      assert(chrome.exitCode === 0, `${label} Chromium failed: ${browserOutput}`);
      assert(
        browserOutput.includes('Reader-free runtime acceptance'),
        `${label} Chromium did not render the root screen.`,
      );
      assert(
        !/pdfjs-dist|pdf\.worker|Error:|TypeError:|ReferenceError:/u.test(browserOutput),
        `${label} Chromium reported an unexpected error: ${browserOutput}`,
      );
    } else {
      assert(
        bundle.status === 500,
        `${label} expected the established Expo 57 Reader/PDF HTTP 500 baseline, received ${bundle.status}.`,
      );
      assert(
        hasPdfWorker || /pdfjs-dist|pdf\.worker/u.test(logs.join('')),
        `${label} control no longer reaches the expected Reader/PDF graph.`,
      );
    }
    assert(
      !logs.join('').includes('Worker chunk not found') || variant !== 'reader-free',
      `${label} Metro reached the PDF worker.`,
    );
    console.log(
      `${label}: Metro ${bundle.status}; PDF graph ${hasPdfWorker ? 'reachable' : 'absent'}.`,
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
  console.log(`Packed candidate ${basename(candidatePath)} SHA-256 ${integrity}`);

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
