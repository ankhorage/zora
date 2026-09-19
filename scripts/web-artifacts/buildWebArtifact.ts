import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

import { createWebBuildPlugins } from './createWebBuildPlugins';
import type {
  WebArtifactManifestEntry,
  WebArtifactRuntimeExport,
  WebArtifactTarget,
} from './types';

interface BuildWebArtifactPaths {
  readonly cacheRoot: string;
  readonly repositoryRoot: string;
  readonly sourceRoot: string;
  readonly surfacePackageRoot: string;
  readonly webDistRoot: string;
}

/*** Build one discovered ZORA runtime export into the canonical CLI artifact layout. */
export async function buildWebArtifact(
  target: WebArtifactTarget,
  paths: BuildWebArtifactPaths,
): Promise<WebArtifactManifestEntry> {
  const outputDirectory = join(paths.webDistRoot, target.component);
  const entrypointDirectory = join(paths.cacheRoot, target.component);
  const entrypoint = join(entrypointDirectory, `${target.exportName}.ts`);

  await rm(outputDirectory, { force: true, recursive: true });
  await mkdir(outputDirectory, { recursive: true });
  await mkdir(entrypointDirectory, { recursive: true });
  await writeFile(entrypoint, createEntrypoint(target, entrypointDirectory), 'utf8');

  try {
    await bundleWebArtifact(target, entrypoint, outputDirectory, paths);
    await writeDeclaration(target, outputDirectory);
    await writeArtifactManifest(target, outputDirectory);
  } finally {
    await rm(entrypointDirectory, { force: true, recursive: true });
  }

  return createManifestEntry(target);
}

/*** Create the catalog entry owned by one generated artifact directory. */
function createManifestEntry(target: WebArtifactTarget): WebArtifactManifestEntry {
  return {
    component: target.component,
    exportName: target.exportName,
    featurePath: target.featurePath,
    files: [`${target.exportName}.js`, `${target.exportName}.d.ts`],
    sourceKind: target.sourceKind,
  };
}

/*** Create one feature-runtime entrypoint so composing exports share their internal contexts. */
function createEntrypoint(target: WebArtifactTarget, entrypointDirectory: string): string {
  const source = toModuleSpecifier(relative(entrypointDirectory, target.sourceEntry));
  const exportNames = target.runtimeExports
    .map((runtimeExport) => runtimeExport.exportName)
    .join(', ');
  return `export { ${exportNames} } from ${JSON.stringify(source)};\n`;
}

/*** Bundle one browser artifact with React/ReactDOM as its only allowed runtime peers. */
async function bundleWebArtifact(
  target: WebArtifactTarget,
  entrypoint: string,
  outputDirectory: string,
  paths: BuildWebArtifactPaths,
): Promise<void> {
  let result: Awaited<ReturnType<typeof Bun.build>>;
  try {
    result = await Bun.build({
      entrypoints: [entrypoint],
      outdir: outputDirectory,
      target: 'browser',
      format: 'esm',
      splitting: false,
      minify: false,
      conditions: ['browser', 'import', 'default'],
      external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
      plugins: createWebBuildPlugins({
        sourceRoot: paths.sourceRoot,
        surfacePackageRoot: paths.surfacePackageRoot,
      }),
      jsx: {
        development: false,
        factory: 'React.createElement',
        fragment: 'React.Fragment',
        importSource: 'react',
        runtime: 'automatic',
        sideEffects: false,
      },
    });
  } catch (error) {
    throw new Error(
      `Could not build ZORA web target "${target.component}":\n${formatBuildFailure(error)}`,
      { cause: error },
    );
  }
  if (!result.success) {
    throw new Error(
      `Could not build ZORA web target "${target.component}":\n${result.logs.map(String).join('\n')}`,
    );
  }

  const bundlePath = join(outputDirectory, `${target.exportName}.js`);
  await normalizeClientDirective(bundlePath, target.runtimeKind === 'component');
  await validateBundle(target, bundlePath);
}

/*** Normalize bundled client directives so Next.js sees one valid module-level directive. */
async function normalizeClientDirective(
  bundlePath: string,
  forceClientDirective: boolean,
): Promise<void> {
  const source = await readFile(bundlePath, 'utf8');
  const clientDirective = /^[ \t]*["']use client["'];[ \t]*\r?\n/gm;
  const hasClientDirective = clientDirective.test(source);
  clientDirective.lastIndex = 0;
  if (!hasClientDirective && !forceClientDirective) return;

  const normalized = source.replace(clientDirective, '');
  await writeFile(bundlePath, `'use client';\n${normalized}`, 'utf8');
}

/*** Validate that a generated artifact is production React and dependency-self-contained. */
async function validateBundle(target: WebArtifactTarget, bundlePath: string): Promise<void> {
  const source = await readFile(bundlePath, 'utf8');
  if (source.includes('jsxDEV') || source.includes('react/jsx-dev-runtime')) {
    throw new Error(`ZORA web target "${target.component}" uses the development JSX runtime.`);
  }
  if (source.includes("from 'web-worker'") || source.includes('require("web-worker")')) {
    throw new Error(
      `ZORA web target "${target.component}" exposes the optional Node web-worker import.`,
    );
  }
  const unsupportedImport = findUnsupportedRuntimeImport(source);
  if (unsupportedImport !== undefined) {
    throw new Error(
      `ZORA web target "${target.component}" leaked runtime dependency "${unsupportedImport}".`,
    );
  }
}

/*** Write an exact specialized declaration or a portable declaration for generic exports. */
async function writeDeclaration(target: WebArtifactTarget, outputDirectory: string): Promise<void> {
  const outputPath = join(outputDirectory, `${target.exportName}.d.ts`);
  if (target.declarationSource !== undefined) {
    await copyFile(target.declarationSource, outputPath);
    return;
  }
  await writeFile(outputPath, createPortableDeclaration(target), 'utf8');
}

/*** Create dependency-light declarations for every runtime export sharing the feature facade. */
function createPortableDeclaration(target: WebArtifactTarget): string {
  const declarations = target.runtimeExports.map(createPortableRuntimeDeclaration);
  const imports = target.runtimeExports.some(
    (runtimeExport) => runtimeExport.runtimeKind === 'component',
  )
    ? ["import type React from 'react';", '']
    : [];

  return [...imports, ...declarations, ''].join('\n');
}

/*** Create one portable declaration without exposing ZORA or Surface as consumer dependencies. */
function createPortableRuntimeDeclaration(runtimeExport: WebArtifactRuntimeExport): string {
  if (runtimeExport.runtimeKind === 'component') {
    return `export declare const ${runtimeExport.exportName}: React.ComponentType<Record<string, unknown>>;`;
  }
  if (runtimeExport.runtimeKind === 'callable') {
    return `export declare const ${runtimeExport.exportName}: (...args: unknown[]) => unknown;`;
  }
  return `export declare const ${runtimeExport.exportName}: unknown;`;
}

/*** Persist the existing manifest contract consumed by the generic ZORA create command. */
async function writeArtifactManifest(
  target: WebArtifactTarget,
  outputDirectory: string,
): Promise<void> {
  await writeFile(
    join(outputDirectory, 'artifact.json'),
    `${JSON.stringify(createManifestEntry(target), null, 2)}\n`,
    'utf8',
  );
}

/*** Find a bare runtime import that should have been bundled into the artifact. */
function findUnsupportedRuntimeImport(source: string): string | undefined {
  const matches = source.matchAll(/(?:from\s+|import\(|require\()(["'])([^"'./][^"']*)\1/g);
  for (const match of matches) {
    const specifier = match[2];
    if (
      specifier !== undefined &&
      specifier !== 'react' &&
      !specifier.startsWith('react/') &&
      specifier !== 'react-dom' &&
      !specifier.startsWith('react-dom/')
    ) {
      return specifier;
    }
  }
  return undefined;
}

/*** Render Bun aggregate failures with their individual source positions. */
function formatBuildFailure(error: unknown): string {
  if (error instanceof AggregateError) return error.errors.map(formatBuildMessage).join('\n');
  return error instanceof Error ? error.message : String(error);
}

/*** Render one Bun build message with a useful source position when available. */
function formatBuildMessage(entry: unknown): string {
  if (typeof entry !== 'object' || entry === null) return String(entry);
  const record = entry as Record<string, unknown>;
  const message = typeof record.message === 'string' ? record.message : String(entry);
  const position =
    typeof record.position === 'object' && record.position !== null
      ? (record.position as Record<string, unknown>)
      : undefined;
  if (position === undefined) return message;

  const file = typeof position.file === 'string' ? position.file : '(unknown file)';
  const line = typeof position.line === 'number' ? position.line : 0;
  const column = typeof position.column === 'number' ? position.column : 0;
  const lineText = typeof position.lineText === 'string' ? position.lineText : '';
  return `${file}:${line}:${column} ${message}\n${lineText}`;
}

/*** Convert a filesystem-relative path to an ESM module specifier. */
function toModuleSpecifier(path: string): string {
  const normalized = path.replaceAll('\\', '/');
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}
