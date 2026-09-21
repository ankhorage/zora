import { resolve } from 'node:path';

import { synchronizeDeclaredWebComponentsWithNodeAsync } from '../../features/web-component-artifact/composition/synchronizeDeclaredWebComponentsWithNodeAsync';

interface ZoraSyncCommandRequest {
  readonly argv: readonly string[];
  readonly context: {
    readonly cwd: string;
    writeStderr(text: string): void;
    writeStdout(text: string): void;
  };
}

/*** Reconcile the declared web component set from the installed ZORA provider. */
export async function sync(
  request: ZoraSyncCommandRequest,
): Promise<{ readonly exitCode: number }> {
  try {
    if (request.argv.length !== 1 || request.argv[0] !== '--web') {
      throw new Error('Usage: ankh zora sync --web');
    }
    const result = await synchronizeDeclaredWebComponentsWithNodeAsync(
      resolve(request.context.cwd),
    );
    request.context.writeStdout(
      `Synchronized ${result.components.length} ZORA web component(s) at ${result.outputDirectory}\n`,
    );
    return { exitCode: 0 };
  } catch (error) {
    request.context.writeStderr(
      `ZORA sync failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return { exitCode: 1 };
  }
}
