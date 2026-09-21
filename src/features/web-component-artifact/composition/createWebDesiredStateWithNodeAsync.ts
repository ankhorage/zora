import { randomUUID } from 'node:crypto';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
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
  const desiredPath = resolve(input.projectRoot, 'zora.web.json');
  const previous = await readFile(desiredPath, 'utf8').catch((error: unknown) => {
    if (isMissingFile(error)) return undefined;
    throw error;
  });
  const next = `${JSON.stringify({ schemaVersion: 1, components }, null, 2)}\n`;
  if (next !== previous) await replaceDesiredStateAsync(desiredPath, next);
  try {
    return await synchronizeWebComponentArtifactsWithNodeAsync({
      components,
      outputDirectory: resolve(input.projectRoot, '.ankh', 'zora', 'web'),
      packageRoot,
      packageVersion: packageJson.version,
    });
  } catch (error) {
    if (next !== previous) {
      try {
        if (previous === undefined) await rm(desiredPath);
        else await replaceDesiredStateAsync(desiredPath, previous);
      } catch (rollbackError) {
        throw new AggregateError([error, rollbackError], 'ZORA create and rollback failed.', {
          cause: rollbackError,
        });
      }
    }
    throw error;
  }
}

/*** Replace the authoritative project declaration only after its complete contents are staged. */
async function replaceDesiredStateAsync(path: string, content: string): Promise<void> {
  const temporaryPath = join(dirname(path), `.zora-web-${randomUUID()}.tmp`);
  try {
    await writeFile(temporaryPath, content, 'utf8');
    await rename(temporaryPath, path);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

/*** Recognize only absent desired state, not unrelated filesystem failures. */
function isMissingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
