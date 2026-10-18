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
      const chrome = Bun.spawnSync(
        [
          chromiumCommand,
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--enable-logging=stderr',
          '--v=1',
          '--dump-dom',
          rootUrl,
        ],
        { cwd: root, stderr: 'pipe', stdout: 'pipe' },
      );
      const browserOutput = `${chrome.stdout.toString()}\n${chrome.stderr.toString()}`;
      logs.push(`browser console and network output:\n${browserOutput}\n`);
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
