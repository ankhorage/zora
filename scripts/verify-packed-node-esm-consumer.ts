import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zora-packed-node-esm-consumer-'));
const skipBuild = process.argv.includes('--skip-build');
const consumerDevelopmentDependencies = readConsumerDevelopmentDependencies();

/*** Run one isolated consumer command and retain its output when it fails. */
function run(command: readonly string[], cwd: string): void {
  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    env: {
      ...process.env,
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
        devDependencies: consumerDevelopmentDependencies,
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'acceptance.mjs'),
    `import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { compileZoraTheme } from '@ankhorage/zora/theme';
import * as capabilities from '@ankhorage/zora/capabilities';

const packageRoot = join(process.cwd(), 'node_modules', '@ankhorage', 'zora');
const collectFiles = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => entry.isDirectory() ? collectFiles(join(directory, entry.name)) : entry.name.endsWith('.js') || entry.name.endsWith('.d.ts') ? [join(directory, entry.name)] : []))).flat();
for (const emittedDirectory of ['dist', 'web-dist']) for (const path of await collectFiles(join(packageRoot, emittedDirectory))) {
  const source = await readFile(path, 'utf8');
  assert.doesNotMatch(source, /(?:from|import\\()\\s*['\"]\\.{1,2}\\/[^'\"]*(?<!\\.js)['\"]/u, path);
  if (emittedDirectory !== 'dist') continue;
  const sourceMapUrl = /\\/\\/# sourceMappingURL=(.+)$/mu.exec(source)?.[1];
  if (sourceMapUrl === undefined) continue;
  const sourceMapPath = join(path, '..', sourceMapUrl);
  assert.equal(existsSync(sourceMapPath), true, sourceMapPath);
  const sourceMap = JSON.parse(await readFile(sourceMapPath, 'utf8'));
  assert.equal(sourceMap.file, basename(path), sourceMapPath);
  assert.equal(typeof sourceMap.mappings, 'string', sourceMapPath);
  assert.equal(Array.isArray(sourceMap.sources), true, sourceMapPath);
}
assert.equal(typeof compileZoraTheme, 'function');
assert.equal(typeof capabilities, 'object');
console.log('Packed ZORA Node ESM consumer imports explicit emitted module specifiers.');
`,
  );
  writeFileSync(
    join(consumerRoot, 'tsconfig.node-next.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          skipLibCheck: false,
          strict: true,
        },
        files: ['node-next.ts'],
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(consumerRoot, 'node-next.ts'),
    `import { CAPABILITIES } from '@ankhorage/zora/capabilities';

const capabilities: typeof CAPABILITIES = [];
void capabilities;
`,
  );
}

/*** Read the repository-owned TypeScript pin required by strict declaration checking. */
function readConsumerDevelopmentDependencies(): Readonly<Record<string, string>> {
  const packageJson = JSON.parse(readFileSync(join(repositoryRoot, 'package.json'), 'utf8')) as {
    devDependencies?: Readonly<Record<string, unknown>>;
  };
  const version = packageJson.devDependencies?.typescript;
  if (typeof version !== 'string') throw new Error('Expected a TypeScript development dependency.');
  return { typescript: version };
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
  run(['node_modules/.bin/tsc', '--project', 'tsconfig.node-next.json'], consumerRoot);
  console.log('Packed ZORA Node ESM consumer imports explicit emitted module specifiers.');
} finally {
  rmSync(temporaryRoot, { force: true, recursive: true });
}
