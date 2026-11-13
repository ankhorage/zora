import {
  appendFileSync,
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
import {
  createExpoMetroCommand,
  createExpoNativeRunCommand,
  getExpoNativeMetroPort,
} from './utils/createExpoNativeCommand';

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
  let metro: MetroProcess | undefined;
  let primaryError: unknown;
  try {
    metro = await startMetroAsync(root);
    if (platform === 'android') configureAndroidMetroRouting(root, metro.port);
    run(createExpoNativeRunCommand(platform), root);
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
    run(['maestro', 'hierarchy'], root);
  } catch (error) {
    primaryError = error;
  } finally {
    const cleanupError = await cleanupMetroAsync(metro, platform, root);
    if (primaryError === undefined && cleanupError !== undefined) primaryError = cleanupError;
  }
  if (primaryError !== undefined) throw primaryError;
}

/** Start the debug JavaScript server explicitly because native Debug builds do not embed it. */
async function startMetroAsync(root: string) {
  mkdirSync(diagnosticRoot, { recursive: true });
  const port = getExpoNativeMetroPort();
  const logPath = join(diagnosticRoot, 'metro.log');
  const metro = Bun.spawn(createExpoMetroCommand(), {
    cwd: root,
    env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1' },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = captureMetroOutputAsync(metro, logPath);
  const deadline = Date.now() + 30_000;
  try {
    while (Date.now() < deadline) {
      const exitCode = await Promise.race([Bun.sleep(100).then(() => undefined), metro.exited]);
      if (exitCode !== undefined)
        throw new Error(
          `Metro exited before readiness (pid ${metro.pid}, port ${port}, exit ${exitCode}). See ${logPath}.`,
        );
      const response = await fetch(`http://127.0.0.1:${port}/status`).catch(() => undefined);
      if (response?.ok && (await response.text()).includes('packager-status:running'))
        return { output, port, process: metro };
    }
    throw new Error(
      `Metro did not report packager readiness on http://127.0.0.1:${port}/status (pid ${metro.pid}). See ${logPath}.`,
    );
  } catch (error) {
    metro.kill();
    await Promise.allSettled([metro.exited, output]);
    throw error;
  }
}

/** Route Android's default debug-server address to the separately owned loopback Metro process. */
function configureAndroidMetroRouting(root: string, port: number) {
  const route = `tcp:${port}`;
  run(['adb', 'reverse', route, route], root);
  const result = Bun.spawnSync({ cmd: ['adb', 'reverse', '--list'], cwd: root });
  const output = new TextDecoder().decode(result.stdout);
  if (retainCommandOutput) writeFileSync(join(diagnosticRoot, 'android-metro-routing.log'), output);
  assert(result.exitCode === 0, 'Could not inspect Android Metro routing.');
  assert(output.includes(`${route} ${route}`), `Android Metro route is missing: ${route}.`);
}

type MetroProcess = Readonly<{
  output: Promise<void>;
  port: number;
  process: ReturnType<typeof Bun.spawn>;
}>;

/** Persist each Metro stream as it arrives so process failures cannot be hidden by pipe backpressure. */
async function captureMetroOutputAsync(process: ReturnType<typeof Bun.spawn>, path: string) {
  writeFileSync(path, `pid=${process.pid}\n`);
  await Promise.all([
    copyMetroStreamAsync('stderr', process.stderr, path),
    copyMetroStreamAsync('stdout', process.stdout, path),
  ]);
}

/** Drain one Metro output stream continuously into the bounded diagnostics artifact. */
async function copyMetroStreamAsync(
  name: string,
  stream: ReadableStream<Uint8Array> | null,
  path: string,
) {
  if (stream === null) return;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const result = await reader.read();
    if (result.done) return;
    appendFileSync(path, `[${name}] ${decoder.decode(result.value, { stream: true })}`);
  }
}

/** Stop Metro and collect platform diagnostics without masking the acceptance failure that triggered cleanup. */
async function cleanupMetroAsync(
  metro: MetroProcess | undefined,
  platform: 'android' | 'ios',
  root: string,
) {
  try {
    metro?.process.kill();
    await Promise.allSettled(metro === undefined ? [] : [metro.process.exited, metro.output]);
    captureDeviceDiagnostics(platform, root);
  } catch (error) {
    return error;
  }
}

/** Retain platform logs without copying generated consumers, dependency trees, or build products. */
function captureDeviceDiagnostics(platform: 'android' | 'ios', root: string) {
  const command =
    platform === 'android'
      ? ['adb', 'logcat', '-d']
      : ['xcrun', 'simctl', 'spawn', 'booted', 'log', 'show', '--last', '2m', '--style', 'compact'];
  const result = Bun.spawnSync({ cmd: command, cwd: root });
  writeFileSync(
    join(diagnosticRoot, `${platform}-app.log`),
    new TextDecoder().decode(result.stdout),
  );
  if (platform === 'ios')
    Bun.spawnSync({
      cmd: ['xcrun', 'simctl', 'io', 'booted', 'screenshot', join(diagnosticRoot, 'ios.png')],
      cwd: root,
    });
}

await testPackedFlowCanvasNativeAsync();
