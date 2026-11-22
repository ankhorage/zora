import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-node-esm-consumer-'));
const skipBuild = process.argv.includes('--skip-build');

/*** Run one isolated consumer command and retain its output when it fails. */
function run(command: readonly string[], cwd: string): void {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: {
      ...process.env,
      BUN_INSTALL_CACHE_DIR: join(temporaryRoot, 'bun-cache'),
      CI: '1',
      npm_config_cache: join(temporaryRoot, 'npm-cache'),
    },
    stderr: 'pipe',
    stdout: 'pipe',
  });
  const output = `${result.stdout.toString()}\n${result.stderr.toString()}`;
  assert.equal(result.exitCode, 0, `${command.join(' ')} failed:\n${output}`);
}

/*** Write a clean Node ESM consumer that only references the packed package. */
function writeConsumer(consumerRoot: string, tarballPath: string): void {
  writeFileSync(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'zora-packed-node-esm-consumer-acceptance',
        private: true,
        type: 'module',
        dependencies: {
          '@ankhorage/zora': `file:${tarballPath}`,
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { compileZoraTheme } from '@ankhorage/zora/theme';
import * as capabilities from '@ankhorage/zora/capabilities';

const packageRoot = join(process.cwd(), 'node_modules', '@ankhorage', 'zora');
const collectFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => entry.isDirectory() ? collectFiles(join(directory, entry.name)) : entry.name.endsWith('.js') ? [join(directory, entry.name)] : []))).flat();
for (const emittedDirectory of ['dist', 'web-dist']) for (const path of await collectFiles(join(packageRoot, emittedDirectory))) {
  const source = await readFile(path, 'utf8');
  assert.doesNotMatch(source, /(?:from|import\\()\\s*['\"]\\.{1,2}\\/[^'\"]*(?<!\\.js)['\"]/u, path);
}
assert.equal(typeof compileZoraTheme, 'function');
assert.equal(typeof capabilities, 'object');
console.log('Packed ZORA Node ESM consumer imports explicit emitted module specifiers.');
`,
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
  );
  const tarballs = readdirSync(packageDirectory).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected exactly one packed ZORA tarball.');
  const [tarball] = tarballs;
  if (tarball === undefined) throw new Error('Expected a packed ZORA tarball.');
  mkdirSync(consumerRoot);
  writeConsumer(consumerRoot, join(packageDirectory, tarball));
  run(['npm', 'install', '--ignore-scripts', '--legacy-peer-deps', '--omit=peer'], consumerRoot);
  run(['node', 'acceptance.mjs'], consumerRoot);
  console.log('Packed ZORA Node ESM consumer imports explicit emitted module specifiers.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
