import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { isRecord } from '@ankhorage/utility/object';

/*** Read the version-controlled desired component set outside generated output. */
export async function readWebDesiredStateWithNodeAsync(
  projectRoot: string,
  allowMissing: boolean,
): Promise<{ readonly components: readonly string[] }> {
  const path = resolve(projectRoot, 'zora.web.json');
  const source = await readFile(path, 'utf8').catch((error: unknown) => {
    if (allowMissing && error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  });
  if (source === undefined) return { components: [] };
  const parsed: unknown = JSON.parse(source);
  if (
    !isRecord(parsed) ||
    parsed.schemaVersion !== 1 ||
    !Array.isArray(parsed.components) ||
    !parsed.components.every((component) => typeof component === 'string')
  ) {
    throw new Error(`Invalid ZORA web desired state: ${path}`);
  }
  return { components: parsed.components };
}
