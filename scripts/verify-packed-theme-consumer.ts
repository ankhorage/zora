import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-theme-consumer-'));
const skipBuild = process.argv.includes('--skip-build');
const nodeTypesVersion = readDevelopmentDependencyVersion('@types/node');
const reactTypesVersion = readDevelopmentDependencyVersion('@types/react');
const expoVersion = readInstalledPackageVersion('expo');
const peerDependencies = readPeerDependencies();
const typescriptVersion = readDevelopmentDependencyVersion('typescript');

/*** Read one declared development dependency range for the isolated consumer. */
function readDevelopmentDependencyVersion(dependency: string): string {
  const packageJson = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')) as {
    readonly devDependencies?: Readonly<Record<string, unknown>>;
  };
  const version = packageJson.devDependencies?.[dependency];
  if (typeof version !== 'string')
    throw new Error(`Expected a declared ${dependency} development dependency.`);
  return version;
}

/*** Read one installed Expo version used to prove source-backed consumer compatibility. */
function readInstalledPackageVersion(dependency: string): string {
  const packageJson = JSON.parse(
    readFileSync(join(repositoryRoot, 'node_modules', dependency, 'package.json'), 'utf8'),
  ) as { readonly version?: unknown };
  if (typeof packageJson.version !== 'string') {
    throw new Error(`Expected installed ${dependency} package metadata.`);
  }
  return packageJson.version;
}

/*** Read the ZORA peer contract required to typecheck its public declarations. */
function readPeerDependencies(): Readonly<Record<string, string>> {
  const packageJson = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')) as {
    readonly peerDependencies?: Readonly<Record<string, unknown>>;
  };
  const dependencies = packageJson.peerDependencies;
  if (!dependencies) throw new Error('Expected declared ZORA peer dependencies.');
  if (Object.values(dependencies).some((version) => typeof version !== 'string'))
    throw new Error('Expected ZORA peer dependency ranges to be strings.');
  return dependencies as Readonly<Record<string, string>>;
}

/*** Run one consumer-boundary command and retain its output on failure. */
function run(
  command: readonly string[],
  cwd: string,
  environment: Readonly<Record<string, string>> = {},
): void {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: { ...process.env, CI: '1', ...environment },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${result.stdout.toString()}\n${result.stderr.toString()}`;
  assert.equal(result.exitCode, 0, `${command.join(' ')} failed:\n${output}`);
}

/*** Create a strict Expo and Node ESM consumer that uses only ZORA's public theme subpath. */
function writeConsumer(consumerRoot: string, tarballPath: string): void {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-theme-consumer-acceptance',
        private: true,
        type: 'module',
        dependencies: { '@ankhorage/zora': `file:${tarballPath}` },
        devDependencies: {
          ...peerDependencies,
          '@types/node': nodeTypesVersion,
          '@types/react': reactTypesVersion,
          expo: expoVersion,
          typescript: typescriptVersion,
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        extends: 'expo/tsconfig.base',
        compilerOptions: {
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          types: ['node'],
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'index.mts'),
    "import { compileZoraTheme } from '@ankhorage/zora/theme';\nvoid compileZoraTheme;\n",
  );
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    "import assert from 'node:assert/strict';\nimport { compileZoraTheme } from '@ankhorage/zora/theme';\nassert.equal(typeof compileZoraTheme, 'function');\n",
  );
}

try {
  const packageDirectory = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  if (!skipBuild) run(['bun', 'run', 'build'], repositoryRoot);
  mkdirSync(packageDirectory);
  run(
    ['npm', 'pack', '--ignore-scripts', '--silent', '--pack-destination', packageDirectory],
    repositoryRoot,
    { npm_config_cache: join(temporaryRoot, 'npm-cache') },
  );
  const tarballs = readdirSync(packageDirectory).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one packed ZORA tarball.');
  const tarball = tarballs[0];
  if (tarball === undefined) throw new Error('Expected a packed ZORA tarball.');
  mkdirSync(consumerRoot);
  writeConsumer(consumerRoot, join(packageDirectory, tarball));
  run(['bun', 'install', '--ignore-scripts'], consumerRoot, {
    BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
    TMPDIR: temporaryRoot,
  });
  run(['node', 'acceptance.mjs'], consumerRoot);
  run(['bun', 'acceptance.mjs'], consumerRoot);
  run(['bunx', 'tsc', '--noEmit'], consumerRoot);
  console.log('Packed ZORA theme consumer Expo TypeScript, Node ESM, and Bun resolution passed.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
