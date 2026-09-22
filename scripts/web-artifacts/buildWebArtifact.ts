import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { createWebBuildPlugins } from './createWebBuildPlugins';
import type {
  WebArtifactManifestEntry,
  WebArtifactRuntimeExport,
  WebArtifactTarget,
} from './types';

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
      await writeDeclaration(target, outputDirectory);
      await writeAlias(target, outputDirectory);
      return {
        component: target.component,
        exportName: target.exportName,
        featurePath: target.featurePath,
        files: [
          entry,
          declaration,
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
  await Promise.all([
    writeFile(
      join(outputDirectory, 'index.js'),
      `'use client';\nexport * from './${target.exportName}.js';\n`,
      'utf8',
    ),
    writeFile(
      join(outputDirectory, 'index.d.ts'),
      `export * from './${target.exportName}';\n`,
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
  const themeSource = join(
    paths.sourceRoot,
    'features',
    'theme',
    'composition',
    'useZoraTheme.ts',
  );
  await mkdir(dirname(entry), { recursive: true });
  await writeFile(
    entry,
    [
      `export { ZoraProvider } from ${JSON.stringify(
        toModuleSpecifier(relative(dirname(entry), providerSource)),
      )};`,
      `export { useZoraTheme } from ${JSON.stringify(
        toModuleSpecifier(relative(dirname(entry), themeSource)),
      )};`,
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
      pending.push(next.replaceAll('\\', '/'));
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
  const imports = source.matchAll(/(?:from\s+|import\(|require\()(["'])([^"'./][^"']*)\1/g);
  for (const match of imports) {
    const specifier = match[2];
    if (
      specifier !== undefined &&
      specifier !== 'react' &&
      !specifier.startsWith('react/') &&
      specifier !== 'react-dom' &&
      !specifier.startsWith('react-dom/')
    ) {
      throw new Error(`ZORA web output leaked runtime dependency "${specifier}".`);
    }
  }
}

/*** Preserve exact specialized declarations or emit portable public component types. */
async function writeDeclaration(target: WebArtifactTarget, outputDirectory: string): Promise<void> {
  const outputPath = join(outputDirectory, `${target.exportName}.d.ts`);
  if (target.declarationSource !== undefined) {
    await copyFile(target.declarationSource, outputPath);
    return;
  }
  const declarations = target.runtimeExports.map(createPortableRuntimeDeclaration);
  await writeFile(
    outputPath,
    ["import type React from 'react';", '', ...declarations, ''].join('\n'),
    'utf8',
  );
}

/*** Emit a portable declaration without requiring full ZORA or Surface packages. */
function createPortableRuntimeDeclaration(runtimeExport: WebArtifactRuntimeExport): string {
  if (runtimeExport.runtimeKind === 'component') {
    return `export declare const ${runtimeExport.exportName}: React.ComponentType<Record<string, unknown>>;`;
  }
  if (runtimeExport.runtimeKind === 'callable') {
    return `export declare const ${runtimeExport.exportName}: (...args: unknown[]) => unknown;`;
  }
  return `export declare const ${runtimeExport.exportName}: unknown;`;
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
    "  initialMode?: ZoraThemeMode;",
    "  mode?: ZoraThemeMode;",
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
  const normalized = path.replaceAll('\\', '/');
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}
