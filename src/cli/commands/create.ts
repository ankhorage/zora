import { resolve } from 'node:path';

import { createWebDesiredStateWithNodeAsync } from '../../features/web-component-artifact/composition/createWebDesiredStateWithNodeAsync';

interface ZoraCreateCommandRequest {
  readonly argv: readonly string[];
  readonly context: {
    readonly cwd: string;
    writeStderr(text: string): void;
    writeStdout(text: string): void;
  };
}

/*** Add one web component to project desired state and reconcile its shared runtime. */
export async function create(
  request: ZoraCreateCommandRequest,
): Promise<{ readonly exitCode: number }> {
  try {
    const [component, platform] = request.argv;
    if (request.argv.length !== 2 || component === undefined || platform !== '--web') {
      throw new Error('Usage: ankh zora create <component> --web');
    }
    const result = await createWebDesiredStateWithNodeAsync({
      component,
      projectRoot: resolve(request.context.cwd),
    });
    request.context.writeStdout(
      `Materialized ZORA ${component} with ${result.components.length} web component(s) at ${result.outputDirectory}\n`,
    );
    return { exitCode: 0 };
  } catch (error) {
    request.context.writeStderr(
      `ZORA create failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    return { exitCode: 1 };
  }
}
