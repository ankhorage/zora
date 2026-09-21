import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readWebDesiredStateWithNodeAsync } from '../adapters/outbound/node/readWebDesiredStateWithNodeAsync';
import { synchronizeWebComponentArtifactsWithNodeAsync } from './synchronizeWebComponentArtifactsWithNodeAsync';

/*** Add one requested web component and regenerate the complete declared set. */
export async function createWebDesiredStateWithNodeAsync(input: {
  readonly component: string;
  readonly projectRoot: string;
}) {
  const desired = await readWebDesiredStateWithNodeAsync(input.projectRoot, true);
  const components = [...new Set([...desired.components, input.component])].sort();
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
  const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8')) as {
    readonly version: string;
  };
  const result = await synchronizeWebComponentArtifactsWithNodeAsync({
    components,
    outputDirectory: resolve(input.projectRoot, '.ankh', 'zora', 'web'),
    packageRoot,
    packageVersion: packageJson.version,
  });
  await writeFile(
    resolve(input.projectRoot, 'zora.web.json'),
    `${JSON.stringify({ schemaVersion: 1, components }, null, 2)}\n`,
    'utf8',
  );
  return result;
}
