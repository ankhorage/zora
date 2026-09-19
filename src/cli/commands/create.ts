import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { materializeWebComponentArtifactWithNodeAsync } from '../../features/web-component-artifact/composition/materializeWebComponentArtifactWithNodeAsync';

interface ZoraCreateCommandRequest {
  readonly argv: readonly string[];
  readonly context: {
    readonly cwd: string;
    writeStderr(text: string): void;
    writeStdout(text: string): void;
  };
}

/*** Materialize a canonical ZORA component for a platform-specific consumer. */
export async function create(
  request: ZoraCreateCommandRequest,
): Promise<{ readonly exitCode: number }> {
  try {
    const options = parseCreateArguments(request.argv);
    const packageJsonPath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../../../package.json',
    );
    const packageRoot = dirname(packageJsonPath);
    const packageVersion = await readPackageVersionAsync(packageJsonPath);
    const outputDirectory =
      options.outputDirectory === undefined
        ? resolve(request.context.cwd, 'src', 'generated', 'zora', options.component)
        : resolve(request.context.cwd, options.outputDirectory);

    const result = await materializeWebComponentArtifactWithNodeAsync({
      component: options.component,
      outputDirectory,
      packageRoot,
      packageVersion,
    });

    request.context.writeStdout(
      [
        `Created ZORA ${result.component} for ${result.platform} at ${result.outputDirectory}`,
        ...result.createdFiles.map((filePath) => `  ${filePath}`),
        '',
      ].join('\n'),
    );
    return { exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    request.context.writeStderr(`ZORA create failed: ${message}\n`);
    return { exitCode: 1 };
  }
}

interface CreateOptions {
  readonly component: string;
  readonly outputDirectory?: string;
}

/*** Parse the intentionally small first web-materialization command surface. */
function parseCreateArguments(argv: readonly string[]): CreateOptions {
  const [component, platformFlag, outputFlag, outputDirectory] = argv;
  const hasDefaultOutput = argv.length === 2 && platformFlag === '--web';
  const hasCustomOutput =
    argv.length === 4 &&
    platformFlag === '--web' &&
    outputFlag === '--out' &&
    outputDirectory !== undefined &&
    outputDirectory.trim() !== '';

  if (
    component === undefined ||
    component.trim() === '' ||
    (!hasDefaultOutput && !hasCustomOutput)
  ) {
    throw new Error('Usage: ankh zora create <component> --web [--out <directory>]');
  }

  return {
    component,
    ...(hasCustomOutput ? { outputDirectory } : {}),
  };
}

/*** Read the installed package version used to stamp generated artifacts. */
async function readPackageVersionAsync(packageJsonPath: string): Promise<string> {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
    readonly version?: unknown;
  };

  if (typeof packageJson.version !== 'string' || packageJson.version.trim() === '') {
    throw new Error('ZORA package.json must define a non-empty version.');
  }

  return packageJson.version;
}
