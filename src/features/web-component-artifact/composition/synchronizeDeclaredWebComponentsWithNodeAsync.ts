import { resolve } from 'node:path';

import { readWebDesiredStateWithNodeAsync } from '../adapters/outbound/node/readWebDesiredStateWithNodeAsync';
import { readWebComponentPackageMetadataAsync } from './readWebComponentPackageMetadataAsync';
import { synchronizeWebComponentArtifactsWithNodeAsync } from './synchronizeWebComponentArtifactsWithNodeAsync';

/*** Load project desired state and sync it from the active ZORA package release. */
export async function synchronizeDeclaredWebComponentsWithNodeAsync(projectRoot: string) {
  const desired = await readWebDesiredStateWithNodeAsync(projectRoot, false);
  const { packageRoot, packageVersion } = await readWebComponentPackageMetadataAsync();
  return await synchronizeWebComponentArtifactsWithNodeAsync({
    components: desired.components,
    outputDirectory: resolve(projectRoot, '.ankh', 'zora', 'web'),
    packageRoot,
    packageVersion,
  });
}
