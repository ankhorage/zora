import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/*** Reads the active ZORA package location and version for generated web artifacts. */
export async function readWebComponentPackageMetadataAsync(): Promise<WebComponentPackageMetadata> {
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
  const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8')) as {
    readonly version: string;
  };

  return { packageRoot, packageVersion: packageJson.version };
}

interface WebComponentPackageMetadata {
  readonly packageRoot: string;
  readonly packageVersion: string;
}
