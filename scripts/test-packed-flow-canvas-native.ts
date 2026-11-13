import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve, sep } from 'node:path';

import { assert } from './utils/assert';

const repositoryRoot = resolve(import.meta.dir, '..');
const fixtureSource = join(repositoryRoot, 'test-fixtures', 'flow-canvas-native');
const temporaryBase = process.env.FLOW_NATIVE_TMPDIR ?? tmpdir();
mkdirSync(temporaryBase, { recursive: true });
const temporaryRoot = mkdtempSync(join(temporaryBase, 'zora-flow-native-'));
const fixtureRoot = join(temporaryRoot, 'consumer');
const packedRoot = join(temporaryRoot, 'packed');
const diagnosticRoot = join(
  process.env.FLOW_NATIVE_DIAGNOSTIC_DIR ?? temporaryBase,
  'zora-flow-native-diagnostics',
);
const ignoredSegments = new Set(['.expo', 'android', 'ios', 'node_modules']);
let commandNumber = 0;
let retainCommandOutput = false;

/** Build a packed candidate, prove Metro resolves only its public FlowCanvas export, and run Maestro when supplied. */
async function testPackedFlowCanvasNativeAsync() {
  try {
    run(['bun', 'run', 'build'], repositoryRoot);
    run(['bun', 'pm', 'pack', '--destination', packedRoot], repositoryRoot);
    const candidate = singleTarball(packedRoot);
    copyFixture(fixtureSource, fixtureRoot);
    configureFixture(fixtureRoot, candidate);
    run(['bun', 'install'], fixtureRoot);
    run(['bun', 'install', '--frozen-lockfile'], fixtureRoot);
    verifyInstalledCandidate(fixtureRoot, candidate);
    run(['bunx', 'expo', 'export', '--platform', 'android'], fixtureRoot);
    run(['bunx', 'expo', 'export', '--platform', 'ios'], fixtureRoot);
    if (process.env.FLOW_NATIVE_RUN_MAESTRO === '1') await runMaestroAsync(fixtureRoot);
    else
      console.log(
        'Packed native Metro acceptance passed; Maestro execution is intentionally opt-in.',
      );
  } finally {
    if (process.env.FLOW_NATIVE_KEEP_ARTIFACTS !== '1')
      rmSync(temporaryRoot, { force: true, recursive: true });
    else console.log(`Retained native acceptance artifacts: ${temporaryRoot}`);
  }
}

/** Execute a process and fail at its owning acceptance boundary. */
function run(command: readonly string[], cwd: string) {
  console.log(`> (${cwd}) ${command.join(' ')}`);
  const result = Bun.spawnSync({
    cmd: command,
    cwd,
    env: {
      ...process.env,
      BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
      CI: '1',
      EXPO_NO_TELEMETRY: '1',
      TMPDIR: temporaryRoot,
    },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${new TextDecoder().decode(result.stdout)}${new TextDecoder().decode(result.stderr)}`;
  if (retainCommandOutput) {
    mkdirSync(diagnosticRoot, { recursive: true });
    writeFileSync(
      join(
        diagnosticRoot,
        `${String(++commandNumber).padStart(2, '0')}-${command[1] ?? command[0]}.log`,
      ),
      output,
    );
  }
  process.stdout.write(output);
  assert(result.exitCode === 0, `Command failed: ${command.join(' ')}`);
}

/** Copy the committed consumer while excluding generated host projects and installations. */
function copyFixture(source: string, destination: string) {
  cpSync(source, destination, {
    filter: (path) =>
      !relative(source, path)
        .split(sep)
        .some((part) => ignoredSegments.has(part)),
    recursive: true,
  });
}

/** Replace the fixture placeholder with the exact packed candidate, never a checkout path. */
function configureFixture(root: string, candidate: string) {
  const path = join(root, 'package.json');
  const manifest = JSON.parse(readFileSync(path, 'utf8')) as {
    dependencies: Record<string, string>;
  };
  manifest.dependencies['@ankhorage/zora'] = `file:${candidate}`;
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Reject source imports and prove the installed package owns the Metro FlowCanvas resolution. */
function verifyInstalledCandidate(root: string, candidate: string) {
  const installed = join(root, 'node_modules', '@ankhorage', 'zora');
  const manifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8')) as {
    exports: Record<string, { 'react-native'?: string }>;
  };
  const flowSource = manifest.exports['./flow']?.['react-native'];
  assert(
    flowSource === './src/features/flow/public.ts',
    'Packed package lacks the native public FlowCanvas export.',
  );
  assert(
    existsSync(join(installed, flowSource)),
    'Installed package lacks the FlowCanvas public source entry.',
  );
  assert(
    readFileSync(join(root, 'bun.lock'), 'utf8').includes(basename(candidate)),
    'Lockfile does not retain the packed candidate.',
  );
  assert(
    !readFileSync(join(root, 'App.tsx'), 'utf8').includes(repositoryRoot),
    'Native host imports the repository checkout.',
  );
}

/** Locate the one package archive emitted by the canonical Bun packing workflow. */
function singleTarball(root: string): string {
  const archives = readdirSync(root).filter((entry) => entry.endsWith('.tgz'));
  assert(
    archives.length === 1,
    `Expected one packed candidate, found ${archives.join(', ') || 'none'}.`,
  );
  return join(root, archives[0]!);
}

/** Run real Maestro touch automation against a locally booted native host. */
async function runMaestroAsync(root: string) {
  const platform = process.env.FLOW_NATIVE_PLATFORM;
  assert(
    platform === 'android' || platform === 'ios',
    'Set FLOW_NATIVE_PLATFORM to android or ios.',
  );
  retainCommandOutput = true;
  run(['bunx', 'expo', 'prebuild', '--no-install', '--platform', platform], root);
  run(['maestro', '--version'], root);
  const metro = await startMetroAsync(root);
  try {
    run(['bunx', 'expo', 'run:' + platform, '--no-bundler'], root);
    run(
      [
        'maestro',
        'test',
        '--test-output-dir',
        join(diagnosticRoot, 'maestro'),
        join('maestro', 'flow-canvas.yaml'),
      ],
      root,
    );
  } finally {
    metro.kill();
    writeFileSync(join(diagnosticRoot, 'metro.log'), await readOutputAsync(metro));
    captureDeviceDiagnostics(platform, root);
  }
}

/** Start the debug JavaScript server explicitly because native Debug builds do not embed it. */
async function startMetroAsync(root: string) {
  const metro = Bun.spawn(
    ['bunx', 'expo', 'start', '--localhost', '--port', '8081', '--no-interactive'],
    {
      cwd: root,
      env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1' },
      stderr: 'pipe',
      stdout: 'pipe',
    },
  );
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch('http://127.0.0.1:8081')).ok) return metro;
    } catch {}
    await Bun.sleep(250);
  }
  metro.kill();
  throw new Error('Metro did not become ready on http://127.0.0.1:8081.');
}

/** Read a completed process stream after shutting down the owned Metro lifecycle. */
async function readOutputAsync(process: ReturnType<typeof Bun.spawn>) {
  const [stderr, stdout] = await Promise.all([
    new Response(process.stderr).text(),
    new Response(process.stdout).text(),
  ]);
  return `${stdout}${stderr}`;
}

/** Retain platform logs without copying generated consumers, dependency trees, or build products. */
function captureDeviceDiagnostics(platform: 'android' | 'ios', root: string) {
  if (platform !== 'android') return;
  const result = Bun.spawnSync({ cmd: ['adb', 'logcat', '-d'], cwd: root });
  writeFileSync(
    join(diagnosticRoot, 'android-logcat.log'),
    new TextDecoder().decode(result.stdout),
  );
}

await testPackedFlowCanvasNativeAsync();
