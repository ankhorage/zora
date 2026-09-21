import { randomUUID } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  readFile,
  readlink,
  realpath,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

import type { WebComponentArtifactFileSystemPort } from '../../../application/ports/outbound/WebComponentArtifactFileSystemPort';

/*** Create the Node filesystem adapter used by ZORA web-component materialization. */
export function createNodeWebComponentArtifactFileSystem(
  platform: NodeJS.Platform = process.platform,
): WebComponentArtifactFileSystemPort {
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
      const previousDirectory =
        previous === undefined ? undefined : await realpath(outputDirectory);
      if (
        previousDirectory !== undefined &&
        (dirname(previousDirectory) !== (await realpath(parent)) ||
          !isGeneratedDirectoryName(basename(previousDirectory)))
      ) {
        throw new Error(`Refusing to replace non-ZORA materialization: ${outputDirectory}`);
      }
      const temporaryLink = join(parent, `.web-link-${randomUUID()}`);
      try {
        await symlink(
          platform === 'win32' ? stageDirectory : basename(stageDirectory),
          temporaryLink,
          platform === 'win32' ? 'junction' : 'dir',
        );
        if (platform === 'win32' && previousDirectory !== undefined) {
          await replaceWindowsJunctionAsync(temporaryLink, outputDirectory);
        } else {
          await rename(temporaryLink, outputDirectory);
        }
      } finally {
        await rm(temporaryLink, { force: true });
      }
      if (
        previousDirectory !== undefined &&
        previousDirectory !== (await realpath(stageDirectory))
      ) {
        await rm(previousDirectory, { force: true, recursive: true }).catch(() => undefined);
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

/*** Swap Windows junctions with rollback because rename cannot replace an occupied destination. */
async function replaceWindowsJunctionAsync(temporaryLink: string, outputDirectory: string) {
  const previousLink = join(dirname(outputDirectory), `.web-link-${randomUUID()}`);
  await rename(outputDirectory, previousLink);
  try {
    await rename(temporaryLink, outputDirectory);
  } catch (error) {
    try {
      await rename(previousLink, outputDirectory);
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'ZORA web swap and rollback failed.', {
        cause: rollbackError,
      });
    }
    throw error;
  }
  await rm(previousLink, { force: true });
}

/*** Recognize only the private generation directories written by this adapter. */
function isGeneratedDirectoryName(value: string): boolean {
  return /^\.web-gen-[A-Za-z0-9]+$/u.test(value);
}

/*** Distinguish a missing first-generation link from other filesystem errors. */
function isMissingFile(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
