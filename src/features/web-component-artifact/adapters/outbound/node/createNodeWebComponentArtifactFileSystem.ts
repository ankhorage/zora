import { mkdir, readFile, writeFile } from 'node:fs/promises';

import type { WebComponentArtifactFileSystemPort } from '../../../application/ports/outbound/WebComponentArtifactFileSystemPort';

/*** Create the Node filesystem adapter used by ZORA web-component materialization. */
export function createNodeWebComponentArtifactFileSystem(): WebComponentArtifactFileSystemPort {
  return {
    async ensureDirectoryAsync(path) {
      await mkdir(path, { recursive: true });
    },
    async readTextFileAsync(path) {
      return await readFile(path, 'utf8');
    },
    async writeTextFileAsync(path, content) {
      await writeFile(path, content, 'utf8');
    },
  };
}
