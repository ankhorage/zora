import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AnkhCommandProviderManifest } from '@ankhorage/contracts/cli';

import { CAPABILITIES } from '../capabilities';
import { create } from './commands/create';
import { sync } from './commands/sync';

const CREATE_COMMAND = {
  path: ['create'],
  capability: CAPABILITIES[0].id,
  summary: 'Materialize a canonical ZORA component for a target platform.',
} as const;
const SYNC_COMMAND = {
  path: ['sync'],
  capability: CAPABILITIES[1].id,
  summary: 'Regenerate the declared ZORA web materialization.',
} as const;

interface ZoraRuntimeProvider extends AnkhCommandProviderManifest {
  readonly handlers: readonly {
    readonly path: readonly string[];
    readonly handler: typeof create | typeof sync;
  }[];
}

const provider = {
  id: '@ankhorage/zora',
  category: 'zora',
  version: readPackageVersion(),
  capabilities: CAPABILITIES,
  commands: [CREATE_COMMAND, SYNC_COMMAND],
  handlers: [
    {
      path: CREATE_COMMAND.path,
      handler: create,
    },
    {
      path: SYNC_COMMAND.path,
      handler: sync,
    },
  ],
} satisfies ZoraRuntimeProvider;

export default provider;

/*** Read the installed ZORA version for the Ankh provider manifest. */
function readPackageVersion(): string {
  const packageJson = JSON.parse(
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../package.json'), 'utf8'),
  ) as { readonly version?: unknown };

  if (typeof packageJson.version !== 'string' || packageJson.version.trim() === '') {
    throw new Error('ZORA package.json must define a non-empty version.');
  }

  return packageJson.version;
}
