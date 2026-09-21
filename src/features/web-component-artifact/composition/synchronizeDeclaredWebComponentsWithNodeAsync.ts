import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readWebDesiredStateWithNodeAsync } from '../adapters/outbound/node/readWebDesiredStateWithNodeAsync';
import { synchronizeWebComponentArtifactsWithNodeAsync } from './synchronizeWebComponentArtifactsWithNodeAsync';

/*** Load project desired state and sync it from the active ZORA package release. */
export async function synchronizeDeclaredWebComponentsWithNodeAsync(projectRoot: string) {
  const desired = await readWebDesiredStateWithNodeAsync(projectRoot, false);
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
  const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8')) as {
    readonly version: string;
  };
  return await synchronizeWebComponentArtifactsWithNodeAsync({
    components: desired.components,
    outputDirectory: resolve(projectRoot, '.ankh', 'zora', 'web'),
    packageRoot,
    packageVersion: packageJson.version,
  });
}
