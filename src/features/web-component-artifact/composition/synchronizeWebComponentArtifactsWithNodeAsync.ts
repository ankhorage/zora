import { readFile } from 'node:fs/promises';

import { createNodeWebComponentArtifactFileSystem } from '../adapters/outbound/node/createNodeWebComponentArtifactFileSystem';
import {
  synchronizeWebComponentArtifactsAsync,
  type SynchronizeWebComponentArtifactsInput,
  type SynchronizeWebComponentArtifactsResult,
} from '../application/use-cases/synchronizeWebComponentArtifactsAsync';

/*** Wire Node filesystem operations into shared ZORA web reconciliation. */
export async function synchronizeWebComponentArtifactsWithNodeAsync(
  input: Omit<SynchronizeWebComponentArtifactsInput, 'consumerDependencies'> & {
    readonly projectRoot: string;
  },
): Promise<SynchronizeWebComponentArtifactsResult> {
  return await synchronizeWebComponentArtifactsAsync(
    {
      ...input,
      consumerDependencies: await readConsumerDependenciesAsync(input.projectRoot),
    },
    createNodeWebComponentArtifactFileSystem(),
  );
}

/*** Read the consuming application's declared production dependencies before materialization. */
async function readConsumerDependenciesAsync(
  projectRoot: string,
): Promise<Readonly<Record<string, string>>> {
  const packagePath = `${projectRoot}/package.json`;
  const packageJson: unknown = JSON.parse(await readFile(packagePath, 'utf8'));
  if (
    typeof packageJson !== 'object' ||
    packageJson === null ||
    !('dependencies' in packageJson) ||
    typeof packageJson.dependencies !== 'object' ||
    packageJson.dependencies === null ||
    Array.isArray(packageJson.dependencies)
  ) {
    throw new Error(`ZORA web materialization requires dependencies in ${packagePath}.`);
  }
  return Object.fromEntries(
    Object.entries(packageJson.dependencies).filter(([, value]) => typeof value === 'string'),
  );
}
