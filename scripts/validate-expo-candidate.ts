import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';

import {
  prepareCandidateProviderCache,
  verifyMaterializedReaderArtifact,
} from './web-artifacts/verifyCandidateReaderArtifact';
import { type ReaderVariant, verifyReaderMetroAsync } from './web-artifacts/verifyReaderMetro';

interface CandidateFixture {
  readonly doctor: boolean;
  readonly expectedWebRoutes?: readonly string[];
  readonly name: string;
  readonly nativeFonts: boolean;
  readonly nativePrebuild: boolean;
  readonly project: string;
}

type JsonObject = Record<string, unknown>;

const REPOSITORY_ROOT = resolve(import.meta.dir, '..');
const TEMPORARY_DIRECTORY = process.env.RUNNER_TEMP ?? '/tmp';
const IGNORED_COPY_SEGMENTS = new Set(['.expo', 'android', 'dist', 'ios', 'node_modules']);
const REQUIRED_WEB_FONT_FAMILIES = [
  'FontAwesome',
  'FontAwesome5Brands-Regular',
  'FontAwesome5Free-Solid',
  'FontAwesome6Brands-Regular',
  'Ionicons',
] as const;
const REQUIRED_NATIVE_FONT_FILES = [
  'FontAwesome.ttf',
  'FontAwesome5_Brands.ttf',
  'FontAwesome5_Regular.ttf',
  'FontAwesome5_Solid.ttf',
  'FontAwesome6_Brands.ttf',
  'FontAwesome6_Regular.ttf',
  'FontAwesome6_Solid.ttf',
  'Ionicons.ttf',
] as const;
const RESTAURANT_WEB_ROUTES = [
  '/',
  '/(tabs)',
  '/(tabs)/menu',
  '/(tabs)/orders',
  '/(tabs)/profile',
  '/(tabs)/reservations',
  '/+not-found',
  '/_sitemap',
  '/menu',
  '/orders',
  '/profile',
  '/reservations',
] as const;
const FORBIDDEN_ROUTER_HELPER_ROUTES = ['/ExampleAppBar', '/useZoraIconFonts'] as const;

const FIXTURES: readonly CandidateFixture[] = [
  {
    doctor: true,
    name: 'game-presentation',
    nativeFonts: true,
    nativePrebuild: true,
    project: 'examples/game-presentation',
  },
  {
    doctor: true,
    name: 'showcase',
    nativeFonts: true,
    nativePrebuild: true,
    project: 'examples/expo-showcase',
  },
  {
    doctor: true,
    name: 'grid-workspaces',
    nativeFonts: false,
    nativePrebuild: true,
    project: 'examples/grid-workspaces',
  },
  {
    doctor: false,
    expectedWebRoutes: RESTAURANT_WEB_ROUTES,
    name: 'restaurant',
    nativeFonts: false,
    nativePrebuild: false,
    project: 'examples/food_drink/restaurant',
  },
];

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJsonObject(path: string): JsonObject {
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));

  if (!isJsonObject(value)) {
    throw new Error(`Expected a JSON object in ${path}.`);
  }

  return value;
}

function requireObject(value: unknown, label: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(`Expected ${label} to be an object.`);
  }

  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Expected ${label} to be a string.`);
  }

  return value;
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
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
      CI: '1',
      EXPO_NO_TELEMETRY: '1',
      ...environment,
    },
    stderr: 'inherit',
    stdout: 'inherit',
  });

  if (result.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${result.exitCode}: ${command.join(' ')}`);
  }
}

function capture(command: readonly string[], cwd: string): string {
  console.log(`\n> (${cwd}) ${command.join(' ')}`);

  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: {
      ...process.env,
      CI: '1',
      EXPO_NO_TELEMETRY: '1',
    },
    stderr: 'inherit',
    stdout: 'pipe',
  });

  if (result.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${result.exitCode}: ${command.join(' ')}`);
  }

  const output = result.stdout.toString();
  return output;
}

function copyCleanProject(source: string, destination: string): void {
  cpSync(source, destination, {
    filter: (sourcePath) => {
      const sourceRelativePath = relative(source, sourcePath);
      return !sourceRelativePath.split(sep).some((segment) => IGNORED_COPY_SEGMENTS.has(segment));
    },
    recursive: true,
  });
}

function configureCandidateFixture(
  fixtureRoot: string,
  candidatePath: string,
  readerRange: string | undefined,
): void {
  const packageJsonPath = join(fixtureRoot, 'package.json');
  const packageJson = readJsonObject(packageJsonPath);
  const dependencies = requireObject(packageJson.dependencies, `${packageJsonPath} dependencies`);

  // This file: dependency exists only in the disposable acceptance fixture. Committed
  // example manifests continue to reference the latest released ZORA package.
  dependencies['@ankhorage/zora'] = `file:${candidatePath}`;
  if (readerRange !== undefined) dependencies['@ankhorage/reader'] = readerRange;
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const tsconfigPath = join(fixtureRoot, 'tsconfig.json');
  const tsconfig = readJsonObject(tsconfigPath);
  const compilerOptions = requireObject(
    tsconfig.compilerOptions,
    `${tsconfigPath} compilerOptions`,
  );
  delete compilerOptions.baseUrl;
  delete compilerOptions.paths;
  writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`);

  rmSync(join(fixtureRoot, 'bun.lock'), { force: true });
}

/*** Materialize Reader through Ankh using the packed candidate provider, never a released cache entry. */
function materializeReaderArtifact(fixtureRoot: string, providerCacheRoot: string): void {
  const environment = { ANKH_CACHE_DIR: providerCacheRoot };
  run(['bun', 'x', 'ankh', 'zora', 'create', 'reader', '--web'], fixtureRoot, environment);
  run(['bun', 'x', 'ankh', 'zora', 'sync', '--web'], fixtureRoot, environment);
}

function verifyCandidateGraph(
  fixtureRoot: string,
  candidatePath: string,
  candidateVersion: string,
  expectedSurfaceRange: string,
): void {
  const fixturePackageJson = readJsonObject(join(fixtureRoot, 'package.json'));
  const fixtureDependencies = requireObject(
    fixturePackageJson.dependencies,
    'candidate fixture dependencies',
  );
  assert(
    fixtureDependencies['@ankhorage/zora'] === `file:${candidatePath}`,
    'Candidate fixture no longer points to the packed ZORA tarball.',
  );

  const lockText = readFileSync(join(fixtureRoot, 'bun.lock'), 'utf8');
  assert(
    lockText.includes(basename(candidatePath)),
    'Candidate lockfile does not reference the packed ZORA tarball.',
  );

  const installedZoraRoot = join(fixtureRoot, 'node_modules', '@ankhorage', 'zora');
  const installedZoraPackage = readJsonObject(join(installedZoraRoot, 'package.json'));
  const installedZoraDependencies = requireObject(
    installedZoraPackage.dependencies,
    'installed ZORA dependencies',
  );
  const installedZoraVersion = requireString(
    installedZoraPackage.version,
    'installed ZORA version',
  );
  const installedSurfaceRange = requireString(
    installedZoraDependencies['@ankhorage/surface'],
    'installed ZORA Surface range',
  );

  assert(
    installedZoraVersion === candidateVersion,
    `Expected ZORA ${candidateVersion}, received ${installedZoraVersion}.`,
  );
  assert(
    installedSurfaceRange === expectedSurfaceRange,
    `Expected the candidate to depend on Surface ${expectedSurfaceRange}, received ${installedSurfaceRange}.`,
  );
  assert(
    existsSync(
      join(
        installedZoraRoot,
        'dist',
        'features',
        'gradient',
        'adapters',
        'inbound',
        'GradientRendererContext.js',
      ),
    ),
    'Installed ZORA lacks the candidate-only GradientRendererProvider implementation.',
  );

  const installedSurfacePackage = readJsonObject(
    join(fixtureRoot, 'node_modules', '@ankhorage', 'surface', 'package.json'),
  );
  const installedSurfaceVersion = requireString(
    installedSurfacePackage.version,
    'installed Surface version',
  );
  assert(
    Bun.semver.satisfies(installedSurfaceVersion, installedSurfaceRange),
    `Installed Surface ${installedSurfaceVersion} does not satisfy ${installedSurfaceRange}.`,
  );

  const installedZoraRealPath = realpathSync(installedZoraRoot);
  const graph = capture(['bun', 'pm', 'ls', '--all'], fixtureRoot);
  assert(!graph.includes('@ankhorage/surface@2.'), 'Candidate graph contains Surface 2.');

  console.log(
    `Verified packed ZORA ${installedZoraVersion} at ${installedZoraRealPath} with Surface ${installedSurfaceVersion}.`,
  );
}

function verifyNpmPeerGraph(fixtureRoot: string, npmFixtureRoot: string): void {
  copyCleanProject(fixtureRoot, npmFixtureRoot);
  run(['npm', 'install', '--ignore-scripts'], npmFixtureRoot, {
    npm_config_cache: join(npmFixtureRoot, 'npm-cache'),
  });
  capture(['npm', 'ls', '--all'], npmFixtureRoot);
}

function collectFiles(root: string, suffix: string): readonly string[] {
  const files: string[] = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(path, suffix));
    } else if (entry.isFile() && entry.name.endsWith(suffix)) {
      files.push(path);
    }
  }

  return files;
}

function verifyWebFonts(exportRoot: string): void {
  const javascript = collectFiles(exportRoot, '.js')
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n');

  for (const fontFamily of REQUIRED_WEB_FONT_FAMILIES) {
    assert(
      javascript.includes(fontFamily),
      `Exported Web bundle does not contain the required ${fontFamily} font family.`,
    );
  }
}

function toStaticRoute(exportRoot: string, htmlPath: string): string {
  const routePath = relative(exportRoot, htmlPath)
    .split(sep)
    .join('/')
    .replace(/\.html$/, '');
  return routePath === 'index' ? '/' : `/${routePath.replace(/\/index$/, '')}`;
}

function verifyRouterRouteSurface(exportRoot: string, expectedRoutes: readonly string[]): void {
  const actualRoutes = collectFiles(exportRoot, '.html')
    .map((path) => toStaticRoute(exportRoot, path))
    .sort();
  const sortedExpectedRoutes = [...expectedRoutes].sort();

  for (const forbiddenRoute of FORBIDDEN_ROUTER_HELPER_ROUTES) {
    assert(
      !actualRoutes.includes(forbiddenRoute),
      `Exported Router surface contains implementation-only route ${forbiddenRoute}.`,
    );
  }

  assert(
    JSON.stringify(actualRoutes) === JSON.stringify(sortedExpectedRoutes),
    `Unexpected Router route surface. Expected ${sortedExpectedRoutes.join(', ')}, received ${actualRoutes.join(', ')}.`,
  );

  console.log(`Verified Router route surface: ${actualRoutes.join(', ')}`);
}

function prebuildNativeProject(fixtureRoot: string): void {
  run(
    ['bun', 'x', 'expo', 'prebuild', '--platform', 'ios', '--no-install', '--clean'],
    fixtureRoot,
  );
}

/*** Create a disposable Router route that makes one Reader boundary render a deterministic PDF. */
function addReaderRoute(fixtureRoot: string, variant: ReaderVariant): void {
  const document = createReaderAcceptancePdf();
  const source = `data:application/pdf;base64,${Buffer.from(document).toString('base64')}`;
  const readerImport =
    variant === 'direct'
      ? "import { ReaderView } from '@ankhorage/reader';"
      : "import { Reader } from '../.ankh/zora/web/components/reader/Reader.js';";
  const readerElement =
    variant === 'direct'
      ? '<ReaderView format="pdf" sourceUri={source} />'
      : '<Reader format="pdf" showChrome={false} source={source} />';
  writeFileSync(
    join(fixtureRoot, 'app', 'reader.tsx'),
    `${readerImport}

const source = ${JSON.stringify(source)};

export default function ReaderRoute() {
  return (
    ${readerElement}
  );
}
`,
  );
}

/*** Build a compact, single-page PDF whose text layer is asserted in the real browser. */
function createReaderAcceptancePdf(): string {
  const stream = 'BT /F1 24 Tf 40 80 Td (ZORA Reader acceptance) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 320 160] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let document = '%PDF-1.4\n';
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  document += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    .join('');
  return `${document}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
}

/*** Inspect live Chrome DOM and console signals through the native DevTools protocol. */
async function _verifyReaderInChromeAsync(
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
      const value = evaluation.result?.result?.value;
      const reader = parseReaderRender(value);
      if (
        reader !== undefined &&
        reader.canvas > 0 &&
        reader.text.includes('ZORA Reader acceptance')
      ) {
        assert(
          !consoleErrors.some((error) => /worker/i.test(error)),
          `Reader browser logged a worker error:\n${consoleErrors.join('\n')}`,
        );
        console.log(
          `Reader ${variant} Metro graph URLs:\n${networkUrls.filter((entry) => /bundle|reader|pdfjs|worker/u.test(entry)).join('\n')}`,
        );
        return;
      }
      await Bun.sleep(250);
    }
    throw new Error(
      `Reader browser did not render the PDF canvas and text layer. Console errors:\n${consoleErrors.join('\n')}`,
    );
  } finally {
    session.close();
  }
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

/*** Open a minimal DevTools session while retaining browser console and log errors. */
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
  await new Promise<void>((resolve, reject) => {
    socket.onerror = () => reject(new Error('Could not connect to Chrome DevTools.'));
    socket.onopen = () => resolve();
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
    const text = JSON.stringify(message);
    if (message.method === 'Network.requestWillBeSent') {
      const request = isJsonObject(message.params) ? message.params.request : undefined;
      if (isJsonObject(request) && typeof request.url === 'string') networkUrls.push(request.url);
    }
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
      return await new Promise<JsonObject>((resolve, reject) =>
        pending.set(id, { reject, resolve }),
      );
    },
  };
}

/*** Resolve Chrome from the CI image or the local macOS application bundle. */
function _resolveChromeExecutable(): string {
  const candidates = [
    process.env.CHROME_PATH,
    Bun.which('google-chrome'),
    Bun.which('google-chrome-stable'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter((value): value is string => value !== undefined);
  const chrome = candidates.find((candidate) => existsSync(candidate));
  if (chrome === undefined) {
    throw new Error('Google Chrome is required for the Expo Reader browser acceptance gate.');
  }
  return chrome;
}

function verifyNativeFonts(fixtureRoot: string): void {
  const plistFiles = collectFiles(join(fixtureRoot, 'ios'), '.plist');
  const infoPlist = plistFiles
    .map((path) => readFileSync(path, 'utf8'))
    .find((contents) => contents.includes('<key>UIAppFonts</key>'));
  assert(infoPlist !== undefined, 'Generated iOS project does not declare UIAppFonts.');

  for (const fontFile of REQUIRED_NATIVE_FONT_FILES) {
    assert(infoPlist.includes(fontFile), `Generated iOS project does not declare ${fontFile}.`);
  }
}

/*** Run direct and materialized Reader routes in fresh, dependency-identical Expo fixtures. */
async function verifyReaderVariantsAsync(
  sourceRoot: string,
  candidatePath: string,
  readerRange: string,
  providerCacheRoot: string,
  candidateVersion: string,
  expectedSurfaceRange: string,
  temporaryRoot: string,
): Promise<void> {
  const variants: readonly ReaderVariant[] = ['direct', 'materialized'];
  for (const variant of variants) {
    const fixtureRoot = join(temporaryRoot, `restaurant-reader-${variant}`);
    const exportRoot = join(temporaryRoot, `restaurant-reader-${variant}-web`);
    copyCleanProject(sourceRoot, fixtureRoot);
    configureCandidateFixture(fixtureRoot, candidatePath, readerRange);
    run(['bun', 'install'], fixtureRoot);
    run(['bun', 'x', 'expo', 'install', '--fix'], fixtureRoot);
    rmSync(join(fixtureRoot, 'node_modules'), { force: true, recursive: true });
    run(['bun', 'install', '--frozen-lockfile'], fixtureRoot);
    verifyCandidateGraph(fixtureRoot, candidatePath, candidateVersion, expectedSurfaceRange);
    if (variant === 'materialized') {
      materializeReaderArtifact(fixtureRoot, providerCacheRoot);
      verifyMaterializedReaderArtifact(fixtureRoot, candidateVersion);
    }
    addReaderRoute(fixtureRoot, variant);
    run(['bun', 'run', 'typecheck'], fixtureRoot);
    run(
      ['bun', 'x', 'expo', 'export', '--platform', 'web', '--output-dir', exportRoot, '--clear'],
      fixtureRoot,
    );
    assert(
      collectFiles(exportRoot, '.html')
        .map((path) => toStaticRoute(exportRoot, path))
        .includes('/reader'),
      `Reader ${variant} route is absent from the static Expo export.`,
    );
    await verifyReaderMetroAsync(fixtureRoot, variant);
    console.log(`Reader ${variant} static and live-browser acceptance passed.`);
  }
}

const temporaryRoot = mkdtempSync(join(TEMPORARY_DIRECTORY, 'zora-expo-candidate-'));
const diagnosticsRoot = mkdtempSync(join(TEMPORARY_DIRECTORY, 'zora-expo-candidate-diagnostics-'));
const packageRoot = join(temporaryRoot, 'package');
const providerCacheRoot = join(temporaryRoot, 'ankh-cache');
process.env.ZORA_EXPO_CANDIDATE_DIAGNOSTICS_DIR = diagnosticsRoot;
let completed = false;

try {
  mkdirSync(packageRoot);
  run(['bun', 'run', 'build'], REPOSITORY_ROOT);
  run(['npm', 'pack', '--silent', '--pack-destination', packageRoot], REPOSITORY_ROOT, {
    npm_config_cache: join(temporaryRoot, 'npm-cache'),
  });

  const candidateTarballs = readdirSync(packageRoot).filter((name) => name.endsWith('.tgz'));
  assert(candidateTarballs.length === 1, 'Expected npm pack to produce exactly one tarball.');

  const [candidateTarball] = candidateTarballs;
  assert(candidateTarball !== undefined, 'Expected npm pack to produce a tarball.');
  const candidatePath = join(packageRoot, candidateTarball);
  const sourcePackageJson = readJsonObject(join(REPOSITORY_ROOT, 'package.json'));
  const candidateVersion = requireString(sourcePackageJson.version, 'candidate package version');
  const sourceDependencies = requireObject(
    sourcePackageJson.dependencies,
    'source package dependencies',
  );
  const expectedSurfaceRange = requireString(
    sourceDependencies['@ankhorage/surface'],
    'source package Surface range',
  );
  const readerRange = requireString(
    sourceDependencies['@ankhorage/reader'],
    'source package Reader range',
  );

  console.log(`\nPacked candidate: ${candidatePath}`);
  console.log(`Candidate package version: ${candidateVersion}`);
  prepareCandidateProviderCache(providerCacheRoot, candidatePath, run);

  for (const fixture of FIXTURES) {
    const fixtureRoot = join(temporaryRoot, fixture.name);
    const sourceRoot = join(REPOSITORY_ROOT, fixture.project);
    const exportRoot = join(temporaryRoot, `${fixture.name}-web`);

    copyCleanProject(sourceRoot, fixtureRoot);
    configureCandidateFixture(
      fixtureRoot,
      candidatePath,
      fixture.expectedWebRoutes === undefined ? undefined : readerRange,
    );

    run(['bun', 'install'], fixtureRoot);
    run(['bun', 'x', 'expo', 'install', '--fix'], fixtureRoot);
    rmSync(join(fixtureRoot, 'node_modules'), { force: true, recursive: true });
    run(['bun', 'install', '--frozen-lockfile'], fixtureRoot);

    verifyCandidateGraph(fixtureRoot, candidatePath, candidateVersion, expectedSurfaceRange);
    run(['bun', 'run', 'typecheck'], fixtureRoot);
    run(['bun', 'x', 'expo', 'install', '--check'], fixtureRoot);

    if (fixture.name === 'grid-workspaces') {
      verifyNpmPeerGraph(fixtureRoot, join(temporaryRoot, `${fixture.name}-npm`));
    }

    if (fixture.doctor) {
      run(['bunx', 'expo-doctor@1.20.2'], fixtureRoot);
    }

    run(
      ['bun', 'x', 'expo', 'export', '--platform', 'web', '--output-dir', exportRoot, '--clear'],
      fixtureRoot,
    );
    verifyWebFonts(exportRoot);

    if (fixture.expectedWebRoutes) {
      verifyRouterRouteSurface(exportRoot, fixture.expectedWebRoutes);
      await verifyReaderVariantsAsync(
        sourceRoot,
        candidatePath,
        readerRange,
        providerCacheRoot,
        candidateVersion,
        expectedSurfaceRange,
        temporaryRoot,
      );
    }

    if (fixture.nativePrebuild) {
      prebuildNativeProject(fixtureRoot);
    }

    if (fixture.nativeFonts) {
      verifyNativeFonts(fixtureRoot);
    }

    console.log(`Candidate-backed ${fixture.name} Web export passed: ${exportRoot}`);
  }

  completed = true;
} catch (error) {
  writeFileSync(
    join(diagnosticsRoot, 'failure.log'),
    `${sanitizeDiagnosticText(error instanceof Error ? (error.stack ?? error.message) : String(error))}\n`,
  );
  throw error;
} finally {
  if (completed) {
    rmSync(temporaryRoot, { force: true, recursive: true });
    rmSync(diagnosticsRoot, { force: true, recursive: true });
  } else {
    retainCandidateConfiguration(temporaryRoot, diagnosticsRoot);
    console.error(`Retained Expo candidate diagnostics: ${diagnosticsRoot}`);
  }
}

console.log('\nPacked Expo candidate acceptance passed.');

/*** Retain only inspectable manifest and configuration inputs alongside bounded runtime evidence. */
function retainCandidateConfiguration(temporaryRoot: string, diagnosticsRoot: string): void {
  const files = ['package.json', 'bun.lock', 'app.json', 'tsconfig.json', 'metro.config.js'];
  const roots = [
    REPOSITORY_ROOT,
    ...readdirSync(temporaryRoot).map((name) => join(temporaryRoot, name)),
  ];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const name = root === REPOSITORY_ROOT ? 'candidate' : basename(root);
    for (const file of files) {
      const source = join(root, file);
      if (!existsSync(source)) continue;
      const directory = join(diagnosticsRoot, 'configuration', name);
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, file), readFileSync(source, 'utf8'));
    }
  }
}

/*** Remove common credential fields from the retained top-level failure summary. */
function sanitizeDiagnosticText(contents: string): string {
  return contents.replace(/((?:authorization|cookie|password|token)=)[^&\s]+/giu, '$1<redacted>');
}
