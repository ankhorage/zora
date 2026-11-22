import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { toPortablePath } from '@ankhorage/utility/node/path';
import * as ts from 'typescript';

import { createWebBuildPlugins } from './createWebBuildPlugins';
import type { WebArtifactManifestEntry, WebArtifactTarget } from './types';

interface BuildWebArtifactPaths {
  readonly cacheRoot: string;
  readonly sourceRoot: string;
  readonly surfacePackageRoot: string;
  readonly webDistRoot: string;
}

interface WebArtifactCatalog {
  readonly schemaVersion: 2;
  readonly runtime: { readonly entry: string; readonly files: readonly string[] };
  readonly artifacts: readonly WebArtifactManifestEntry[];
}

/*** Build the provider and all public web targets in one shared module graph. */
export async function buildWebArtifact(
  targets: readonly WebArtifactTarget[],
  paths: BuildWebArtifactPaths,
): Promise<WebArtifactCatalog> {
  const entries = await Promise.all(targets.map((target) => writeEntrypointAsync(target, paths)));
  const providerEntry = await writeProviderEntrypointAsync(paths);
  const result = await bundleWebArtifactsAsync([...entries, providerEntry], paths);
  const outputs = result.metafile?.outputs;
  if (outputs === undefined) throw new Error('ZORA web build did not produce dependency metadata.');

  await Promise.all(
    result.outputs
      .filter((output) => output.path.endsWith('.js'))
      .map(async (output) => {
        await normalizeClientDirective(output.path);
        await validateBundle(output.path);
      }),
  );
  const artifacts = await Promise.all(
    targets.map(async (target) => {
      const entry = `components/${target.component}/${target.exportName}.js`;
      const declaration = `components/${target.component}/${target.exportName}.d.ts`;
      const alias = `components/${target.component}/index.js`;
      const aliasDeclaration = `components/${target.component}/index.d.ts`;
      const outputDirectory = join(paths.webDistRoot, dirname(declaration));
      const declarationFiles = await writeDeclaration(target, outputDirectory);
      await writeAlias(target, outputDirectory);
      return {
        component: target.component,
        exportName: target.exportName,
        featurePath: target.featurePath,
        files: [
          entry,
          ...declarationFiles.map((file) => `components/${target.component}/${file}`),
          alias,
          aliasDeclaration,
          ...collectReachableChunks(entry, outputs, paths.webDistRoot),
        ],
        sourceKind: target.sourceKind,
      } satisfies WebArtifactManifestEntry;
    }),
  );

  await writeFile(
    join(paths.webDistRoot, 'runtime', 'ZoraProvider.d.ts'),
    createProviderDeclaration(),
    'utf8',
  );
  return {
    schemaVersion: 2,
    runtime: {
      entry: 'runtime/ZoraProvider.js',
      files: [
        'runtime/ZoraProvider.js',
        'runtime/ZoraProvider.d.ts',
        ...collectReachableChunks('runtime/ZoraProvider.js', outputs, paths.webDistRoot),
      ],
    },
    artifacts,
  };
}

/*** Give each selected component one stable directory import and type entry. */
async function writeAlias(target: WebArtifactTarget, outputDirectory: string): Promise<void> {
  const typeAlias =
    target.typeExports.length === 0
      ? ''
      : `export type { ${target.typeExports.map(({ exportName }) => exportName).join(', ')} } from './${target.exportName}';\n`;
  await Promise.all([
    writeFile(
      join(outputDirectory, 'index.js'),
      `'use client';\nexport { ${target.exportName} } from './${target.exportName}.js';\n`,
      'utf8',
    ),
    writeFile(
      join(outputDirectory, 'index.d.ts'),
      `export { ${target.exportName} } from './${target.exportName}';\n${typeAlias}`,
      'utf8',
    ),
  ]);
}

/*** Write one bare public entry so provider and components share context modules. */
async function writeEntrypointAsync(
  target: WebArtifactTarget,
  paths: BuildWebArtifactPaths,
): Promise<string> {
  const entry = join(paths.cacheRoot, 'components', target.component, `${target.exportName}.ts`);
  await mkdir(dirname(entry), { recursive: true });
  const source = toModuleSpecifier(relative(dirname(entry), target.sourceEntry));
  const exports = target.runtimeExports.map(({ exportName }) => exportName).join(', ');
  await writeFile(entry, `export { ${exports} } from ${JSON.stringify(source)};\n`, 'utf8');
  return entry;
}

/*** Write the canonical ZORA provider as a peer entry in the same build. */
async function writeProviderEntrypointAsync(paths: BuildWebArtifactPaths): Promise<string> {
  const entry = join(paths.cacheRoot, 'runtime', 'ZoraProvider.ts');
  const providerSource = join(
    paths.sourceRoot,
    'features',
    'theme',
    'adapters',
    'inbound',
    'ZoraProvider.tsx',
  );
  const themeSource = join(paths.sourceRoot, 'features', 'theme', 'composition', 'useZoraTheme.ts');
  const providerSpecifier = JSON.stringify(
    toModuleSpecifier(relative(dirname(entry), providerSource)),
  );
  const themeSpecifier = JSON.stringify(toModuleSpecifier(relative(dirname(entry), themeSource)));
  await mkdir(dirname(entry), { recursive: true });
  await writeFile(
    entry,
    [
      `export { ZoraProvider } from ${providerSpecifier};`,
      `export { useZoraTheme } from ${themeSpecifier};`,
      '',
    ].join('\n'),
    'utf8',
  );
  return entry;
}

/*** Bundle all entries together so Bun can deduplicate Surface and ZORA contexts. */
async function bundleWebArtifactsAsync(
  entries: readonly string[],
  paths: BuildWebArtifactPaths,
): Promise<Awaited<ReturnType<typeof Bun.build>>> {
  const result = await Bun.build({
    entrypoints: [...entries],
    root: paths.cacheRoot,
    outdir: paths.webDistRoot,
    target: 'browser',
    format: 'esm',
    splitting: true,
    metafile: true,
    minify: false,
    naming: {
      entry: '[dir]/[name].js',
      chunk: 'chunks/[name]-[hash].js',
      asset: 'assets/[name]-[hash].[ext]',
    },
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
  if (!result.success) {
    throw new Error(`Could not build ZORA web artifacts:\n${result.logs.map(String).join('\n')}`);
  }
  return result;
}

/*** Find the exact shared chunks imported by one generated entry. */
function collectReachableChunks(
  entry: string,
  outputs: Bun.BuildMetafile['outputs'],
  outputRoot: string,
): readonly string[] {
  const pending = [entry];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    const output = outputs[`./${current}`];
    if (output === undefined) throw new Error(`Missing ZORA web build output: ${current}`);
    for (const imported of output.imports) {
      if (!imported.path.startsWith('.')) continue;
      const next = relative(outputRoot, resolve(outputRoot, imported.path));
      if (next.startsWith('..') || next.startsWith(sep)) {
        throw new Error(`ZORA web chunk escapes output root: ${imported.path}`);
      }
      pending.push(toPortablePath(next));
    }
  }
  return [...visited].filter((file) => file !== entry).sort();
}

/*** Normalize bundled client directives for Next.js entrypoints and shared chunks. */
async function normalizeClientDirective(bundlePath: string): Promise<void> {
  const source = await readFile(bundlePath, 'utf8');
  const normalized = source.replace(/^[ \t]*["']use client["'];[ \t]*\r?\n/gm, '');
  await writeFile(bundlePath, `'use client';\n${normalized}`, 'utf8');
}

/*** Reject development JSX and package imports outside the portable React runtime. */
async function validateBundle(bundlePath: string): Promise<void> {
  const source = await readFile(bundlePath, 'utf8');
  if (source.includes('jsxDEV') || source.includes('react/jsx-dev-runtime')) {
    throw new Error(`ZORA web output uses the development JSX runtime: ${bundlePath}`);
  }
  const javascript = ts.createSourceFile(
    bundlePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  for (const specifier of collectRuntimeImports(javascript)) {
    if (
      specifier !== 'react' &&
      !specifier.startsWith('react/') &&
      specifier !== 'react-dom' &&
      !specifier.startsWith('react-dom/')
    ) {
      throw new Error(`ZORA web output leaked runtime dependency "${specifier}" in ${bundlePath}.`);
    }
  }
}

/*** Inspect executable imports rather than matching import-looking text inside bundled strings. */
function collectRuntimeImports(root: ts.SourceFile): readonly string[] {
  const specifiers: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require'))
    ) {
      const argument = node.arguments[0];
      if (argument !== undefined && ts.isStringLiteral(argument)) {
        specifiers.push(argument.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(root);
  return specifiers.filter((specifier) => !specifier.startsWith('.') && !specifier.startsWith('/'));
}

/*** Materialize each component declaration and its precise local type dependency closure. */
async function writeDeclaration(
  target: WebArtifactTarget,
  outputDirectory: string,
): Promise<readonly string[]> {
  const outputFile = `${target.exportName}.d.ts`;
  const outputPath = join(outputDirectory, outputFile);
  if (target.declarationSource === undefined) {
    throw new Error(`Missing declaration owner for ZORA web component ${target.component}.`);
  }

  const groups = groupTypeExports(target);
  const dependencies = new DeclarationDependencies(outputDirectory, target.exportName);
  const supports = await Promise.all(
    groups.map(async ({ declarationSource, exportNames }, index) => {
      const supportFile = `${target.exportName}.types-${index}.d.ts`;
      await dependencies.write(declarationSource, supportFile, new Set(exportNames));
      return {
        exportNames,
        supportFile,
        originalSpecifier: declarationModuleSpecifier(target.declarationSource!, declarationSource),
        localSpecifier: `./${supportFile.replace(/\.d\.ts$/u, '')}`,
      };
    }),
  );

  const runtimeSource = await dependencies.materialize(
    target.declarationSource,
    new Map(
      supports.map(({ originalSpecifier, localSpecifier }) => [originalSpecifier, localSpecifier]),
    ),
    new Set(target.runtimeExports.map(({ exportName }) => exportName)),
  );
  const reexports = supports.map(
    ({ exportNames, localSpecifier }) =>
      `export type { ${exportNames.join(', ')} } from '${localSpecifier}';`,
  );
  await writeFile(outputPath, `${runtimeSource.trim()}\n${reexports.join('\n')}\n`, 'utf8');
  return [outputFile, ...dependencies.files()];
}

/*** Writes a declaration module graph locally while preserving only named public type owners. */
class DeclarationDependencies {
  readonly #files = new Set<string>();
  readonly #written = new Map<string, string>();
  #nextDependency = 0;

  constructor(
    private readonly outputDirectory: string,
    private readonly componentName: string,
  ) {}

  /*** Materialize one dependency under a stable local declaration filename. */
  async write(
    sourcePath: string,
    outputFile: string,
    exportNames: ReadonlySet<string> | undefined,
  ): Promise<void> {
    const key = declarationDependencyKey(sourcePath, exportNames);
    this.#written.set(key, outputFile);
    const source = await this.materialize(sourcePath, undefined, exportNames);
    await writeFile(join(this.outputDirectory, outputFile), `${source.trim()}\n`, 'utf8');
    this.#files.add(outputFile);
  }

  /*** Return all declaration files written for one web component entrypoint. */
  files(): readonly string[] {
    return [...this.#files].sort();
  }

  /*** Reduce one declaration module to its public surface and locally resolve its relative imports. */
  async materialize(
    sourcePath: string,
    replacements: ReadonlyMap<string, string> | undefined,
    exportNames?: ReadonlySet<string>,
  ): Promise<string> {
    const source = await readFile(sourcePath, 'utf8');
    const surface = publicDeclarationSurface(source, sourcePath, exportNames);
    const localImports = declarationLocalImports(surface, sourcePath);
    const localReplacements = new Map(replacements);
    for (const localImport of localImports) {
      if (localReplacements.has(localImport.specifier)) continue;
      const outputFile = await this.writeDependency(localImport);
      localReplacements.set(localImport.specifier, `./${outputFile.replace(/\.d\.ts$/u, '')}`);
    }
    const rewritten = [...localReplacements.entries()].reduce(
      (current, [from, to]) => replaceDeclarationSpecifierIfPresent(current, from, to),
      surface,
    );
    assertStandaloneDeclaration(rewritten, sourcePath, [...localReplacements.values()]);
    return rewritten;
  }

  /*** Assign and write the local declaration module needed by one relative import. */
  async writeDependency(localImport: DeclarationLocalImport): Promise<string> {
    const sourcePath = await resolveDeclarationDependency(
      localImport.sourcePath,
      localImport.specifier,
    );
    const key = declarationDependencyKey(sourcePath, localImport.exportNames);
    const existing = this.#written.get(key);
    if (existing !== undefined) return existing;
    const outputFile = `${this.componentName}.dependency-${this.#nextDependency}.d.ts`;
    this.#nextDependency += 1;
    await this.write(sourcePath, outputFile, localImport.exportNames);
    return outputFile;
  }
}

interface DeclarationLocalImport {
  readonly exportNames: ReadonlySet<string> | undefined;
  readonly sourcePath: string;
  readonly specifier: string;
}

/*** Group public type exports by their canonical emitted declaration owner. */
function groupTypeExports(target: WebArtifactTarget) {
  const groups = new Map<string, string[]>();
  for (const item of target.typeExports) {
    const current = groups.get(item.declarationSource);
    if (current === undefined) groups.set(item.declarationSource, [item.exportName]);
    else current.push(item.exportName);
  }
  return [...groups.entries()]
    .map(([declarationSource, exportNames]) => ({
      declarationSource,
      exportNames: [...exportNames].sort(),
    }))
    .sort((left, right) => left.declarationSource.localeCompare(right.declarationSource));
}

/*** Resolve one emitted declaration dependency to its original relative module specifier. */
function declarationModuleSpecifier(fromFile: string, toFile: string): string {
  const path = toPortablePath(relative(dirname(fromFile), toFile)).replace(/\.d\.ts$/u, '');
  return path.startsWith('.') ? path : `./${path}`;
}

/*** Rewrite one exact local declaration dependency to its colocated materialized support file. */
function replaceDeclarationSpecifier(source: string, from: string, to: string): string {
  const replaced = source.replaceAll(`'${from}'`, `'${to}'`).replaceAll(`"${from}"`, `"${to}"`);
  if (replaced === source) throw new Error(`Missing declaration dependency "${from}".`);
  return replaced;
}

/*** Rewrite a facade-associated support declaration only when its runtime declaration consumes it. */
function replaceDeclarationSpecifierIfPresent(source: string, from: string, to: string): string {
  const replaced = source.replaceAll(`'${from}'`, `'${to}'`).replaceAll(`"${from}"`, `"${to}"`);
  return replaced;
}

/*** Resolve the emitted declaration file owned by one relative declaration import. */
async function resolveDeclarationDependency(fromFile: string, specifier: string): Promise<string> {
  const basePath = resolve(dirname(fromFile), specifier);
  const candidates = [basePath, `${basePath}.d.ts`, join(basePath, 'index.d.ts')];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue through the declaration module resolution candidates.
    }
  }
  throw new Error(`Could not resolve ZORA declaration dependency "${specifier}" from ${fromFile}.`);
}

/*** Derive a stable cache key for a declaration module and its selected named exports. */
function declarationDependencyKey(
  sourcePath: string,
  exportNames: ReadonlySet<string> | undefined,
): string {
  return `${sourcePath}\0${exportNames === undefined ? '*' : [...exportNames].sort().join(',')}`;
}

/*** Find local declaration imports that the reduced public declaration surface still needs. */
function declarationLocalImports(
  source: string,
  sourcePath: string,
): readonly DeclarationLocalImport[] {
  const file = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true);
  return file.statements.flatMap((statement) => {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier))
      return [];
    const specifier = statement.moduleSpecifier.text;
    if (!specifier.startsWith('.')) return [];
    return [
      {
        exportNames: importedDeclarationNames(statement),
        sourcePath,
        specifier,
      },
    ];
  });
}

/*** Identify the named exports required through one declaration import when they are statically known. */
function importedDeclarationNames(
  statement: ts.ImportDeclaration,
): ReadonlySet<string> | undefined {
  const bindings = statement.importClause?.namedBindings;
  if (bindings === undefined || ts.isNamespaceImport(bindings)) return undefined;
  return new Set(
    bindings.elements.map((binding) => binding.propertyName?.text ?? binding.name.text),
  );
}

/*** Keep only exported declarations and imports required by that public declaration surface. */
function publicDeclarationSurface(
  source: string,
  path: string,
  exportNames?: ReadonlySet<string>,
): string {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const exported = file.statements.filter((statement) =>
    isSelectedPublicDeclarationStatement(statement, exportNames),
  );
  const publicText = exported
    .map((statement) => publicDeclarationText(statement, file, exportNames))
    .join('\n');
  const imports = file.statements.filter(
    (statement): statement is ts.ImportDeclaration =>
      ts.isImportDeclaration(statement) &&
      importBindingNames(statement).some((name) => publicText.includes(name)),
  );
  return [...imports, ...exported]
    .map((statement) =>
      ts.isImportDeclaration(statement)
        ? statement.getFullText(file).trim()
        : publicDeclarationText(statement, file, exportNames),
    )
    .filter(Boolean)
    .join('\n\n');
}

/*** Render a selected public declaration without retaining sibling names from a facade export list. */
function publicDeclarationText(
  statement: ts.Statement,
  file: ts.SourceFile,
  exportNames: ReadonlySet<string> | undefined,
): string {
  if (
    exportNames !== undefined &&
    ts.isExportDeclaration(statement) &&
    statement.exportClause !== undefined &&
    ts.isNamedExports(statement.exportClause) &&
    statement.moduleSpecifier !== undefined
  ) {
    const elements = statement.exportClause.elements.filter((element) =>
      exportNames.has(element.name.text),
    );
    const rendered = elements.map((element) => {
      const prefix = element.isTypeOnly ? 'type ' : '';
      const original = element.propertyName === undefined ? '' : `${element.propertyName.text} as `;
      return `${prefix}${original}${element.name.text}`;
    });
    return `export { ${rendered.join(', ')} } from ${statement.moduleSpecifier.getText(file)};`;
  }
  return statement.getFullText(file).trim();
}

/*** Identify declarations that belong to the emitted module's public contract. */
function isSelectedPublicDeclarationStatement(
  statement: ts.Statement,
  exportNames: ReadonlySet<string> | undefined,
): boolean {
  if (!isPublicDeclarationStatement(statement)) return false;
  if (exportNames === undefined) return true;
  if (ts.isExportDeclaration(statement)) {
    const clause = statement.exportClause;
    return (
      clause !== undefined &&
      ts.isNamedExports(clause) &&
      clause.elements.some((element) => exportNames.has(element.name.text))
    );
  }
  const name = declarationName(statement);
  return name !== undefined && exportNames.has(name);
}

/*** Identify whether one declaration statement participates in the emitted module's public contract. */
function isPublicDeclarationStatement(statement: ts.Statement): boolean {
  if (ts.isExportDeclaration(statement)) return true;
  return (
    ts.canHaveModifiers(statement) &&
    (ts.getModifiers(statement)?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword) ?? false)
  );
}

/*** Read the direct public declaration name when a statement owns one. */
function declarationName(statement: ts.Statement): string | undefined {
  if (
    ts.isFunctionDeclaration(statement) ||
    ts.isClassDeclaration(statement) ||
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isEnumDeclaration(statement)
  ) {
    return statement.name?.text;
  }
  if (ts.isVariableStatement(statement)) {
    const declaration = statement.declarationList.declarations.at(0);
    return declaration !== undefined && ts.isIdentifier(declaration.name)
      ? declaration.name.text
      : undefined;
  }
  return undefined;
}

/*** Read local binding identifiers introduced by one declaration import. */
function importBindingNames(statement: ts.ImportDeclaration): readonly string[] {
  const clause = statement.importClause;
  if (clause === undefined) return [];
  const names = clause.name === undefined ? [] : [clause.name.text];
  const bindings = clause.namedBindings;
  if (bindings === undefined) return names;
  if (ts.isNamespaceImport(bindings)) return [...names, bindings.name.text];
  return [...names, ...bindings.elements.map(({ name }) => name.text)];
}

/*** Reject relative declaration dependencies that would escape the standalone materialized artifact. */
function assertStandaloneDeclaration(
  source: string,
  path: string,
  allowedLocalSpecifiers: readonly string[] = [],
): void {
  const allowed = new Set(allowedLocalSpecifiers);
  const matchedSpecifiers = Array.from(
    source.matchAll(/(?:from\s+|import\s*\()(['"])(\.{1,2}\/[^'"]+)\1/gu),
    (match) => match[2],
  );
  const localSpecifiers = matchedSpecifiers.filter(
    (specifier): specifier is string => specifier !== undefined && !allowed.has(specifier),
  );
  if (localSpecifiers.length > 0) {
    throw new Error(
      `ZORA web declaration retained local dependencies in ${path}: ${localSpecifiers.join(', ')}`,
    );
  }
}

/*** Describe the generated provider's web-facing props without owner package imports. */
function createProviderDeclaration(): string {
  return [
    "import type React from 'react';",
    '',
    "export type ZoraThemeMode = 'light' | 'dark';",
    '',
    'export interface ZoraRuntimeRoleSemantics {',
    '  base: string;',
    '  hover: string;',
    '  strong: string;',
    '  softBg: string;',
    '  softHover: string;',
    '  softActive: string;',
    '  outline: string;',
    '  onSurfaceText: string;',
    '  onSolidText: string;',
    '  onHoverText: string;',
    '  onStrongText: string;',
    '  onSoftText: string;',
    '  onSoftHoverText: string;',
    '  onSoftActiveText: string;',
    '  disabledBg: string;',
    '  onDisabledText: string;',
    '}',
    '',
    'export interface ZoraRuntimeTheme {',
    '  colors: Readonly<Record<string, string>>;',
    '  spacing: Readonly<Record<string, number>>;',
    '  radii: Readonly<Record<string, number>>;',
    '  semantics: {',
    '    brand: ZoraRuntimeRoleSemantics;',
    '    secondary: ZoraRuntimeRoleSemantics;',
    '    accent: ZoraRuntimeRoleSemantics;',
    '    highlight: ZoraRuntimeRoleSemantics;',
    '    danger: ZoraRuntimeRoleSemantics;',
    '    success: ZoraRuntimeRoleSemantics;',
    '    warning: ZoraRuntimeRoleSemantics;',
    '    error: ZoraRuntimeRoleSemantics;',
    '    info: ZoraRuntimeRoleSemantics;',
    '    surface: {',
    '      default: string;',
    '      subtle: string;',
    '      raised: string;',
    '      sunken: string;',
    '      overlay: string;',
    '      disabled: string;',
    '      inverse: string;',
    '    };',
    '    content: {',
    '      default: string;',
    '      muted: string;',
    '      subtle: string;',
    '      disabled: string;',
    '      icon: string;',
    '      link: string;',
    '      visited: string;',
    '      inverse: string;',
    '    };',
    '    border: {',
    '      default: string;',
    '      subtle: string;',
    '      strong: string;',
    '      divider: string;',
    '      focus: string;',
    '    };',
    '    selection: { background: string; content: string; border: string };',
    '  };',
    '}',
    '',
    'export interface ZoraThemeRuntime {',
    '  readonly theme: ZoraRuntimeTheme;',
    '  readonly mode: ZoraThemeMode;',
    '  readonly setMode: (mode: ZoraThemeMode) => void;',
    '}',
    '',
    'export interface ZoraProviderProps {',
    '  children: React.ReactNode;',
    '  initialMode?: ZoraThemeMode;',
    '  mode?: ZoraThemeMode;',
    '  theme?: { id: string; name: string; appCategory: string; primaryColor: string; harmony: string };',
    '  themeConfig?: Record<string, unknown>;',
    '  toast?: boolean | Record<string, unknown>;',
    '  bottomSheet?: boolean;',
    '}',
    'export declare function ZoraProvider(props: ZoraProviderProps): React.ReactElement;',
    'export declare function useZoraTheme(): ZoraThemeRuntime;',
    '',
  ].join('\n');
}

/*** Render a relative module path as a portable ESM specifier. */
function toModuleSpecifier(path: string): string {
  const normalized = toPortablePath(path);
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}
