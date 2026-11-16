import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-theme-consumer-'));
const skipBuild = process.argv.includes('--skip-build');
const typescriptVersion = readTypescriptVersion();

/*** Read the repository's declared TypeScript range for the isolated consumer. */
function readTypescriptVersion(): string {
  const packageJson = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')) as {
    readonly devDependencies?: Readonly<Record<string, unknown>>;
  };
  const version = packageJson.devDependencies?.typescript;
  if (typeof version !== 'string')
    throw new Error('Expected a declared TypeScript development dependency.');
  return version;
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

/*** Create a NodeNext consumer that uses only ZORA's public theme subpath. */
function writeConsumer(consumerRoot: string, tarballPath: string): void {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-theme-consumer-acceptance',
        private: true,
        type: 'module',
        dependencies: { '@ankhorage/zora': `file:${tarballPath}` },
        devDependencies: { typescript: typescriptVersion },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          strict: true,
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
  console.log('Packed ZORA theme consumer Node ESM, Bun, and NodeNext resolution passed.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
