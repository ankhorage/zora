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
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';

interface CandidateFixture {
  readonly doctor: boolean;
  readonly expectedWebRoutes?: readonly string[];
  readonly name: string;
  readonly nativePrebuild: boolean;
  readonly project: string;
}

type JsonObject = Record<string, unknown>;

const REPOSITORY_ROOT = resolve(import.meta.dir, '..');
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
    name: 'showcase',
    nativePrebuild: true,
    project: 'examples/expo-showcase',
  },
  {
    doctor: false,
    expectedWebRoutes: RESTAURANT_WEB_ROUTES,
    name: 'restaurant',
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

function configureCandidateFixture(fixtureRoot: string, candidatePath: string): void {
  const packageJsonPath = join(fixtureRoot, 'package.json');
  const packageJson = readJsonObject(packageJsonPath);
  const dependencies = requireObject(packageJson.dependencies, `${packageJsonPath} dependencies`);

  // This file: dependency exists only in the disposable acceptance fixture. Committed
  // example manifests continue to reference the latest released ZORA package.
  dependencies['@ankhorage/zora'] = `file:${candidatePath}`;
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

function verifyCandidateGraph(
  fixtureRoot: string,
  candidatePath: string,
  candidateVersion: string,
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
    installedSurfaceRange === '^3.0.0',
    `Expected the candidate to depend on Surface ^3.0.0, received ${installedSurfaceRange}.`,
  );
  assert(
    existsSync(
      join(installedZoraRoot, 'dist', 'components', 'gradient', 'GradientRendererContext.js'),
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
    installedSurfaceVersion === '3.0.0',
    `Expected Surface 3.0.0, received ${installedSurfaceVersion}.`,
  );

  const installedZoraRealPath = realpathSync(installedZoraRoot);
  const graph = capture(['bun', 'pm', 'ls', '--all'], fixtureRoot);
  assert(!graph.includes('@ankhorage/surface@2.'), 'Candidate graph contains Surface 2.');

  console.log(
    `Verified packed ZORA ${installedZoraVersion} at ${installedZoraRealPath} with Surface ${installedSurfaceVersion}.`,
  );
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

function verifyNativeFonts(fixtureRoot: string): void {
  run(
    ['bun', 'x', 'expo', 'prebuild', '--platform', 'ios', '--no-install', '--clean'],
    fixtureRoot,
  );

  const plistFiles = collectFiles(join(fixtureRoot, 'ios'), '.plist');
  const infoPlist = plistFiles
    .map((path) => readFileSync(path, 'utf8'))
    .find((contents) => contents.includes('<key>UIAppFonts</key>'));
  assert(infoPlist !== undefined, 'Generated iOS project does not declare UIAppFonts.');

  for (const fontFile of REQUIRED_NATIVE_FONT_FILES) {
    assert(infoPlist.includes(fontFile), `Generated iOS project does not declare ${fontFile}.`);
  }
}

const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-expo-candidate-'));
const packageRoot = join(temporaryRoot, 'package');
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

  console.log(`\nPacked candidate: ${candidatePath}`);
  console.log(`Candidate package version: ${candidateVersion}`);

  for (const fixture of FIXTURES) {
    const fixtureRoot = join(temporaryRoot, fixture.name);
    const sourceRoot = join(REPOSITORY_ROOT, fixture.project);
    const exportRoot = join(temporaryRoot, `${fixture.name}-web`);

    copyCleanProject(sourceRoot, fixtureRoot);
    configureCandidateFixture(fixtureRoot, candidatePath);

    run(['bun', 'install'], fixtureRoot);
    rmSync(join(fixtureRoot, 'node_modules'), { force: true, recursive: true });
    run(['bun', 'install', '--frozen-lockfile'], fixtureRoot);

    verifyCandidateGraph(fixtureRoot, candidatePath, candidateVersion);
    run(['bun', 'run', 'typecheck'], fixtureRoot);
    run(['bun', 'x', 'expo', 'install', '--check'], fixtureRoot);

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
    }

    if (fixture.nativePrebuild) {
      verifyNativeFonts(fixtureRoot);
    }

    console.log(`Candidate-backed ${fixture.name} Web export passed: ${exportRoot}`);
  }

  completed = true;
} finally {
  if (completed) {
    rmSync(temporaryRoot, { force: true, recursive: true });
  } else {
    console.error(`Candidate fixture retained for diagnosis: ${temporaryRoot}`);
  }
}

console.log('\nPacked Expo candidate acceptance passed.');
