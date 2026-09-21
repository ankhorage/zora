import { randomUUID } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  readlink,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

import type { WebComponentArtifactFileSystemPort } from '../../../application/ports/outbound/WebComponentArtifactFileSystemPort';

/*** Create the Node filesystem adapter used by ZORA web-component materialization. */
export function createNodeWebComponentArtifactFileSystem(): WebComponentArtifactFileSystemPort {
  return {
    joinPath(...parts) {
      return join(...parts);
    },
    async createStageDirectoryAsync(outputDirectory) {
      const parent = dirname(outputDirectory);
      await mkdir(parent, { recursive: true });
      return await mkdtemp(join(parent, '.web-gen-'));
    },
    async commitStageDirectoryAsync(stageDirectory, outputDirectory) {
      const parent = dirname(outputDirectory);
      const previous = await readlink(outputDirectory).catch((error: unknown) => {
        if (isMissingFile(error)) return undefined;
        throw error;
      });
      if (previous !== undefined && !isGeneratedDirectoryName(previous)) {
        throw new Error(`Refusing to replace non-ZORA materialization: ${outputDirectory}`);
      }
      const temporaryLink = join(parent, `.web-link-${randomUUID()}`);
      try {
        await symlink(basename(stageDirectory), temporaryLink, 'dir');
        await rename(temporaryLink, outputDirectory);
      } finally {
        await rm(temporaryLink, { force: true });
      }
      if (previous !== undefined && previous !== basename(stageDirectory)) {
        await rm(join(parent, previous), { force: true, recursive: true }).catch(() => undefined);
      }
    },
    async removeStageDirectoryAsync(stageDirectory) {
      await rm(stageDirectory, { force: true, recursive: true });
    },
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

/*** Recognize only the private generation directories written by this adapter. */
function isGeneratedDirectoryName(value: string): boolean {
  return /^\.web-gen-[A-Za-z0-9]+$/u.test(value);
}

/*** Distinguish a missing first-generation link from other filesystem errors. */
function isMissingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
