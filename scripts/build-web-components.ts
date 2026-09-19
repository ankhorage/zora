import { rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { buildWebArtifact } from './web-artifacts/buildWebArtifact';
import { discoverWebArtifactTargets } from './web-artifacts/discoverWebArtifactTargets';

const repositoryRoot = join(import.meta.dir, '..');
const sourceRoot = join(repositoryRoot, 'src');
const featuresRoot = join(sourceRoot, 'features');
const webDistRoot = join(repositoryRoot, 'web-dist');
const cacheRoot = join(repositoryRoot, '.cache', 'zora-web-artifacts');
const require = createRequire(import.meta.url);
const surfacePackageRoot = dirname(require.resolve('@ankhorage/surface/package.json'));

await rm(webDistRoot, { force: true, recursive: true });
await rm(cacheRoot, { force: true, recursive: true });

try {
  const targets = await discoverWebArtifactTargets({
    featuresRoot,
    repositoryRoot,
    sourceRoot,
  });

  for (const target of targets) {
    await buildWebArtifact(target, {
      cacheRoot,
      repositoryRoot,
      sourceRoot,
      surfacePackageRoot,
      webDistRoot,
    });
  }
} finally {
  await rm(cacheRoot, { force: true, recursive: true });
}
