import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';

import { assert } from './utils/assert';

const repositoryRoot = resolve(import.meta.dir, '..');
const fixtureSource = join(repositoryRoot, 'test-fixtures', 'flow-canvas-native');
const temporaryRoot = mkdtempSync(
  join(process.env.FLOW_NATIVE_TMPDIR ?? '/private/tmp', 'zora-flow-native-'),
);
const fixtureRoot = join(temporaryRoot, 'consumer');
const packedRoot = join(temporaryRoot, 'packed');
const ignoredSegments = new Set(['.expo', 'android', 'ios', 'node_modules']);

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
    if (process.env.FLOW_NATIVE_RUN_MAESTRO === '1') runMaestro(fixtureRoot);
    else
      console.log(
        'Packed native Metro acceptance passed; Maestro execution is intentionally opt-in.',
      );
  } finally {
    if (process.env.FLOW_NATIVE_KEEP_ARTIFACTS !== '1')
      rmSync(temporaryRoot, { force: true, recursive: true });
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
    stderr: 'inherit',
    stdout: 'inherit',
  });
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
function runMaestro(root: string) {
  const platform = process.env.FLOW_NATIVE_PLATFORM;
  assert(
    platform === 'android' || platform === 'ios',
    'Set FLOW_NATIVE_PLATFORM to android or ios.',
  );
  run(['bunx', 'expo', 'prebuild', '--no-install', '--platform', platform], root);
  run(['bunx', 'expo', 'run:' + platform], root);
  run(['maestro', 'test', join('maestro', 'flow-canvas.yaml')], root);
}

await testPackedFlowCanvasNativeAsync();
