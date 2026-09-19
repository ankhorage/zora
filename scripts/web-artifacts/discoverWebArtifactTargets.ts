import { access, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

import * as ts from 'typescript';

import type { WebArtifactTarget } from './types';

interface DiscoveryPaths {
  readonly featuresRoot: string;
  readonly repositoryRoot: string;
  readonly sourceRoot: string;
}

/*** Discover every public runtime feature export as a deterministic web artifact target. */
export async function discoverWebArtifactTargets(
  paths: DiscoveryPaths,
): Promise<readonly WebArtifactTarget[]> {
  const publicEntries = await discoverPublicFeatureEntries(paths.featuresRoot);
  const compilerOptions = readCompilerOptions(paths.repositoryRoot);
  const program = ts.createProgram([...publicEntries], compilerOptions);
  const checker = program.getTypeChecker();
  const candidates = (
    await Promise.all(
      publicEntries.map((publicEntry) =>
        discoverEntryTargets(checker, program, publicEntry, paths),
      ),
    )
  ).flat();

  return deduplicateTargets(candidates);
}

/*** Discover canonical public feature facades recursively. */
async function discoverPublicFeatureEntries(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return await discoverPublicFeatureEntries(path);
      return entry.isFile() && entry.name === 'public.ts' ? [path] : [];
    }),
  );
  return nested.flat().sort();
}

/*** Discover the runtime exports owned or re-exported by one public feature facade. */
async function discoverEntryTargets(
  checker: ts.TypeChecker,
  program: ts.Program,
  publicEntry: string,
  paths: DiscoveryPaths,
): Promise<readonly DiscoveredTarget[]> {
  const sourceFile = program.getSourceFile(publicEntry);
  if (sourceFile === undefined) throw new Error(`Could not load ZORA feature: ${publicEntry}`);
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (moduleSymbol === undefined) return [];

  const featurePath = toPosixPath(relative(paths.featuresRoot, dirname(publicEntry)));
  const runtimeExports = checker.getExportsOfModule(moduleSymbol).flatMap((exportSymbol) => {
    const resolvedSymbol =
      exportSymbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exportSymbol)
        : exportSymbol;
    if ((resolvedSymbol.flags & ts.SymbolFlags.Value) === 0) return [];
    const exportName = exportSymbol.getName();
    if (exportName === 'default') return [];

    return [
      {
        exportName,
        resolvedSymbol,
        runtimeKind: resolveRuntimeKind(checker, resolvedSymbol, exportName),
      },
    ];
  });
  const facadeRuntimeExports = runtimeExports.map(({ exportName, runtimeKind }) => ({
    exportName,
    runtimeKind,
  }));

  return await Promise.all(
    runtimeExports.map(async ({ exportName, resolvedSymbol, runtimeKind }) => {
      const override = await resolveWebArtifactOverride(publicEntry, exportName);
      return {
        component: toKebabCase(exportName),
        declarationSource:
          override === undefined ? undefined : toDistDeclarationPath(override, paths),
        exportName,
        featurePath,
        runtimeKind,
        runtimeExports:
          override === undefined ? facadeRuntimeExports : [{ exportName, runtimeKind }],
        sourceEntry: override ?? publicEntry,
        sourceKind: override === undefined ? 'public' : 'web-artifact',
        symbolIdentity: resolveSymbolIdentity(resolvedSymbol),
      } satisfies DiscoveredTarget;
    }),
  );
}

interface DiscoveredTarget extends WebArtifactTarget {
  readonly symbolIdentity: string;
}

/*** Resolve an optional convention-based standalone browser implementation. */
async function resolveWebArtifactOverride(
  publicEntry: string,
  exportName: string,
): Promise<string | undefined> {
  const featureDirectory = dirname(publicEntry);
  const candidates = [
    join(featureDirectory, 'adapters', 'inbound', 'web-artifact', `${exportName}.tsx`),
    join(featureDirectory, 'adapters', 'inbound', 'web-artifact', `${exportName}.ts`),
  ];
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  return undefined;
}

/*** Resolve a source implementation to its emitted declaration path. */
function toDistDeclarationPath(sourcePath: string, paths: DiscoveryPaths): string {
  const relativeSource = relative(paths.sourceRoot, sourcePath).replace(
    /\.(?:tsx?|mts|cts)$/,
    '.d.ts',
  );
  return join(paths.repositoryRoot, 'dist', relativeSource);
}

/*** Read repository compiler options for accurate feature export resolution. */
function readCompilerOptions(repositoryRoot: string): ts.CompilerOptions {
  const configPath = join(repositoryRoot, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error !== undefined) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  }
  return ts.parseJsonConfigFileContent(config.config, ts.sys, repositoryRoot).options;
}

/*** Classify a runtime export for its dependency-free generated declaration. */
function resolveRuntimeKind(
  checker: ts.TypeChecker,
  symbol: ts.Symbol,
  exportName: string,
): WebArtifactTarget['runtimeKind'] {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.at(0);
  if (declaration === undefined) return 'value';
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const callable = type.getCallSignatures().length > 0 || type.getConstructSignatures().length > 0;
  if (!callable) return 'value';
  return /^[A-Z]/.test(exportName) ? 'component' : 'callable';
}

/*** Identify a runtime symbol independently from aggregate facade re-exports. */
function resolveSymbolIdentity(symbol: ts.Symbol): string {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.at(0);
  if (declaration === undefined) return symbol.getName();
  return `${declaration.getSourceFile().fileName}:${declaration.pos}:${declaration.end}`;
}

/*** Collapse identical re-exports while rejecting two real exports with the same CLI target. */
function deduplicateTargets(
  targets: readonly DiscoveredTarget[],
): readonly WebArtifactTarget[] {
  const resolved = new Map<string, DiscoveredTarget>();
  for (const target of targets) {
    const existing = resolved.get(target.component);
    if (existing === undefined) {
      resolved.set(target.component, target);
      continue;
    }
    if (existing.symbolIdentity !== target.symbolIdentity) {
      throw new Error(
        `Duplicate ZORA web target "${target.component}" from ${existing.featurePath}/${existing.exportName} and ${target.featurePath}/${target.exportName}.`,
      );
    }
    if (featureDepth(target.featurePath) > featureDepth(existing.featurePath)) {
      resolved.set(target.component, target);
    }
  }
  return [...resolved.values()].sort((left, right) =>
    left.component.localeCompare(right.component),
  );
}

/*** Count feature segments so the most specific facade owns an aggregate re-export. */
function featureDepth(featurePath: string): number {
  return featurePath.split('/').length;
}

/*** Convert a TypeScript export name to its stable CLI target. */
function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replaceAll('_', '-')
    .toLowerCase();
}

/*** Check whether a convention-based platform artifact exists. */
async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/*** Normalize manifest-facing paths across operating systems. */
function toPosixPath(path: string): string {
  return path.replaceAll('\\', '/');
}
