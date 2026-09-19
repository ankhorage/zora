import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '..');
const webDistRoot = join(repositoryRoot, 'web-dist');

const artifacts = [
  {
    component: 'tree-view',
    declaration: 'dist/features/tree-view/adapters/inbound/web-artifact/TreeView.d.ts',
    entrypoint: 'src/features/tree-view/adapters/inbound/web-artifact/TreeView.tsx',
    outputName: 'TreeView',
    client: false,
  },
  {
    component: 'graph-view',
    declaration: 'dist/features/graph-view/adapters/inbound/web-artifact/GraphView.d.ts',
    entrypoint: 'src/features/graph-view/adapters/inbound/web-artifact/GraphView.tsx',
    outputName: 'GraphView',
    client: true,
  },
] as const;

await rm(webDistRoot, { force: true, recursive: true });
for (const artifact of artifacts) await buildWebArtifact(artifact);

/** Build one standalone browser artifact together with its declaration and manifest. */
async function buildWebArtifact(artifact: (typeof artifacts)[number]) {
  const outputDirectory = join(webDistRoot, artifact.component);
  await mkdir(outputDirectory, { recursive: true });

  const buildResult = await Bun.build({
    entrypoints: [join(repositoryRoot, artifact.entrypoint)],
    outdir: outputDirectory,
    target: 'browser',
    format: 'esm',
    splitting: false,
    minify: false,
    external: ['react', 'react/jsx-runtime'],
    jsx: {
      development: false,
      factory: 'React.createElement',
      fragment: 'React.Fragment',
      importSource: 'react',
      runtime: 'automatic',
      sideEffects: false,
    },
  });
  if (!buildResult.success) {
    throw new Error(buildResult.logs.map((log) => String(log)).join('\n'));
  }

  const bundleName = `${artifact.outputName}.js`;
  const declarationName = `${artifact.outputName}.d.ts`;
  const bundlePath = join(outputDirectory, bundleName);
  const bundle = await readFile(bundlePath, 'utf8');
  const normalizedBundle = artifact.client ? normalizeClientDirective(bundle) : bundle;
  if (
    normalizedBundle.includes('jsxDEV') ||
    normalizedBundle.includes('react/jsx-dev-runtime')
  ) {
    throw new Error('Web component artifacts must use the production React JSX runtime.');
  }
  if (
    normalizedBundle.includes("from 'web-worker'") ||
    normalizedBundle.includes('require("web-worker")')
  ) {
    throw new Error('Web component artifacts must not expose the optional Node web-worker import.');
  }
  if (artifact.client && !normalizedBundle.startsWith("'use client';\n")) {
    throw new Error('Client web component artifacts must start with the client directive.');
  }
  await writeFile(bundlePath, normalizedBundle, 'utf8');

  await copyFile(
    join(repositoryRoot, artifact.declaration),
    join(outputDirectory, declarationName),
  );
  await writeFile(
    join(outputDirectory, 'artifact.json'),
    `${JSON.stringify(
      {
        component: artifact.component,
        files: [bundleName, declarationName],
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
}

/** Hoist one client directive to the start of a bundled client artifact. */
function normalizeClientDirective(bundle: string): string {
  const withoutDirectives = bundle.replace(/^\s*['"]use client['"];\s*$/gmu, '');
  return `'use client';\n${withoutDirectives.trimStart()}`;
}
