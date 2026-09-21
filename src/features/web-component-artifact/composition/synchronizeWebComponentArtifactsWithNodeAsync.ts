import { createNodeWebComponentArtifactFileSystem } from '../adapters/outbound/node/createNodeWebComponentArtifactFileSystem';
import {
  synchronizeWebComponentArtifactsAsync,
  type SynchronizeWebComponentArtifactsInput,
  type SynchronizeWebComponentArtifactsResult,
} from '../application/use-cases/synchronizeWebComponentArtifactsAsync';

/*** Wire Node filesystem operations into shared ZORA web reconciliation. */
export async function synchronizeWebComponentArtifactsWithNodeAsync(
  input: SynchronizeWebComponentArtifactsInput,
): Promise<SynchronizeWebComponentArtifactsResult> {
  return await synchronizeWebComponentArtifactsAsync(
    input,
    createNodeWebComponentArtifactFileSystem(),
  );
}
