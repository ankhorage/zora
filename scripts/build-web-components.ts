import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { buildWebArtifact } from './web-artifacts/buildWebArtifact';
import {
  createWebBuildPlugins,
  rewriteSurfaceWebSpecifiers,
} from './web-artifacts/createWebBuildPlugins';
import { discoverWebArtifactTargets } from './web-artifacts/discoverWebArtifactTargets';

const repositoryRoot = join(import.meta.dir, '..');
const sourceRoot = join(repositoryRoot, 'src');
const featuresRoot = join(sourceRoot, 'features');
const webDistRoot = join(repositoryRoot, 'web-dist');
const cacheRoot = join(repositoryRoot, '.cache', 'zora-web-artifacts');

await rm(webDistRoot, { force: true, recursive: true });
await rm(cacheRoot, { force: true, recursive: true });

try {
  const targets = await discoverWebArtifactTargets({
    featuresRoot,
    repositoryRoot,
    sourceRoot,
  });

  const catalog = await buildWebArtifact(targets, {
    cacheRoot,
    sourceRoot,
    webDistRoot,
  });
  await buildAuthoringArtifact();

  await mkdir(webDistRoot, { recursive: true });
  await writeFile(
    join(webDistRoot, 'manifest.json'),
    `${JSON.stringify(catalog, null, 2)}\n`,
    'utf8',
  );
} finally {
  await rm(cacheRoot, { force: true, recursive: true });
}

/*** Build the deliberately narrow browser authoring entrypoint as one JSX-free published artifact. */
async function buildAuthoringArtifact(): Promise<void> {
  const outputDirectory = join(webDistRoot, 'authoring');
  const result = await Bun.build({
    entrypoints: [join(sourceRoot, 'authoring.browser.ts')],
    outdir: outputDirectory,
    target: 'browser',
    format: 'esm',
    naming: 'index.js',
    conditions: ['browser', 'import', 'default'],
    external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
    plugins: createWebBuildPlugins(),
    jsx: { runtime: 'automatic', importSource: 'react' },
  });
  if (!result.success) throw new Error(`Could not build ZORA authoring artifact:\n${result.logs}`);
  const declaration = await readFile(
    join(repositoryRoot, 'dist', 'authoring.browser.d.ts'),
    'utf8',
  );
  await writeFile(
    join(outputDirectory, 'index.d.ts'),
    rewriteSurfaceWebSpecifiers(declaration),
    'utf8',
  );
}
