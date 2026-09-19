import { createNodeWebComponentArtifactFileSystem } from '../adapters/outbound/node/createNodeWebComponentArtifactFileSystem';
import {
  materializeWebComponentArtifactAsync,
  type MaterializeWebComponentArtifactInput,
  type MaterializeWebComponentArtifactResult,
} from '../application/use-cases/materializeWebComponentArtifactAsync';

/*** Compose the Node filesystem adapter with the web-component materialization use case. */
export async function materializeWebComponentArtifactWithNodeAsync(
  input: MaterializeWebComponentArtifactInput,
): Promise<MaterializeWebComponentArtifactResult> {
  return await materializeWebComponentArtifactAsync(
    input,
    createNodeWebComponentArtifactFileSystem(),
  );
}
