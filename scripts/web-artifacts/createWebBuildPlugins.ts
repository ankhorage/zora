import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';

import { toPortablePath } from '@ankhorage/utility/node/path';
import * as ts from 'typescript';

interface WebBuildPluginPaths {
  readonly sourceRoot: string;
  readonly surfacePackageRoot: string;
}

interface PackageExportSource {
  readonly importedName: string;
  readonly sourcePath: string;
}

interface PackageRootOwner {
  readonly packageName: string;
  readonly rootEntry: string;
}

const require = createRequire(import.meta.url);
const reactNativeWebEntry = require.resolve('react-native-web');
const safeAreaPackageRoot = dirname(require.resolve('react-native-safe-area-context/package.json'));
const safeAreaPackage = require('react-native-safe-area-context/package.json') as {
  readonly module?: string;
};
const safeAreaEntry = join(safeAreaPackageRoot, safeAreaPackage.module ?? 'lib/module/index.js');

/*** Create portable resolution plugins for standalone React Native Web artifacts. */
export function createWebBuildPlugins(paths: WebBuildPluginPaths) {
  return [
    createPackageRootImportPlugin({
      importerRoots: [paths.sourceRoot, paths.surfacePackageRoot],
      owners: [
        {
          packageName: '@ankhorage/surface',
          rootEntry: join(paths.surfacePackageRoot, 'src', 'index.ts'),
        },
      ],
    }),
    createEmbeddedFontPlugin(),
    createWebPackageAliasPlugin(),
    createWebPlatformPlugin(),
  ];
}

interface PackageRootImportPluginOptions {
  readonly importerRoots: readonly string[];
  readonly owners: readonly PackageRootOwner[];
}

/*** Rewrite named package-root imports to the concrete source module that owns each symbol. */
function createPackageRootImportPlugin(options: PackageRootImportPluginOptions) {
  const owners = options.owners.map((owner) => ({
    ...owner,
    exports: createPackageExportSourceMap(owner),
  }));

  return {
    name: 'zora-package-symbol-imports',
    setup(
      build: Parameters<
        NonNullable<Parameters<typeof Bun.build>[0]['plugins']>[number]['setup']
      >[0],
    ) {
      build.onLoad({ filter: /\.[cm]?[jt]sx?$/ }, async (args) => {
        if (!options.importerRoots.some((root) => args.path.startsWith(root))) return undefined;
        const source = await readFile(args.path, 'utf8');
        const relevantOwners = owners.filter(
          (owner) =>
            source.includes(`'${owner.packageName}'`) || source.includes(`"${owner.packageName}"`),
        );
        if (relevantOwners.length === 0) return undefined;

        return {
          contents: relevantOwners.reduce(
            (result, owner) =>
              rewritePackageRootImports(result, args.path, owner.packageName, owner.exports),
            source,
          ),
          loader: resolveBunLoader(args.path),
        };
      });
    },
  };
}

/*** Resolve every package-root export to its canonical source owner through TypeScript symbols. */
function createPackageExportSourceMap(
  owner: PackageRootOwner,
): ReadonlyMap<string, PackageExportSource> {
  const program = ts.createProgram([owner.rootEntry], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2022,
  });
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(owner.rootEntry);
  if (sourceFile === undefined) {
    throw new Error(`Could not load ${owner.packageName} root entry.`);
  }
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (moduleSymbol === undefined) {
    throw new Error(`Could not resolve ${owner.packageName} exports.`);
  }

  return new Map(
    checker.getExportsOfModule(moduleSymbol).flatMap((exportSymbol) => {
      const resolvedSymbol =
        exportSymbol.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exportSymbol)
          : exportSymbol;
      const declaration = resolvedSymbol.valueDeclaration ?? resolvedSymbol.declarations?.at(0);
      if (declaration === undefined) return [];

      return [
        [
          exportSymbol.getName(),
          {
            importedName: resolvedSymbol.getName(),
            sourcePath: declaration.getSourceFile().fileName,
          },
        ] as const,
      ];
    }),
  );
}

/*** Replace one package-root import while preserving aliases and type-only bindings. */
function rewritePackageRootImports(
  source: string,
  filePath: string,
  packageName: string,
  exportSources: ReadonlyMap<string, PackageExportSource>,
): string {
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const replacements = sourceFile.statements.flatMap((statement) => {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== packageName
    ) {
      return [];
    }

    const clause = statement.importClause;
    if (clause === undefined) return [];
    if (clause.name !== undefined) {
      throw new Error(`Default ${packageName} imports are unsupported in ${filePath}.`);
    }
    if (clause.namedBindings === undefined) return [];
    if (ts.isNamespaceImport(clause.namedBindings)) {
      if (clause.isTypeOnly) return [];
      throw new Error(`Runtime namespace ${packageName} import is unsupported in ${filePath}.`);
    }

    const grouped = new Map<string, { readonly imports: string[]; readonly typeOnly: boolean }>();
    for (const element of clause.namedBindings.elements) {
      const rootName = element.propertyName?.text ?? element.name.text;
      const target = exportSources.get(rootName);
      if (target === undefined) {
        throw new Error(`Unknown ${packageName} export "${rootName}" in ${filePath}.`);
      }

      const typeOnly = clause.isTypeOnly || element.isTypeOnly;
      const modulePath = toModuleSpecifier(relative(dirname(filePath), target.sourcePath));
      const groupKey = `${typeOnly ? 'type' : 'value'}:${modulePath}`;
      const existing = grouped.get(groupKey);
      const imported =
        target.importedName === element.name.text
          ? target.importedName
          : `${target.importedName} as ${element.name.text}`;

      grouped.set(groupKey, {
        imports: [...(existing?.imports ?? []), imported],
        typeOnly,
      });
    }

    const imports = [...grouped.entries()].map(([key, group]) => {
      const modulePath = key.slice(key.indexOf(':') + 1);
      return `import${group.typeOnly ? ' type' : ''} { ${group.imports.join(', ')} } from ${JSON.stringify(modulePath)};`;
    });

    return [
      {
        end: statement.getEnd(),
        start: statement.getStart(sourceFile),
        text: imports.join('\n'),
      },
    ];
  });

  return replacements
    .sort((left, right) => right.start - left.start)
    .reduce(
      (result, replacement) =>
        `${result.slice(0, replacement.start)}${replacement.text}${result.slice(replacement.end)}`,
      source,
    );
}

/*** Embed TrueType fonts so generated web artifacts remain single-file and portable. */
function createEmbeddedFontPlugin() {
  return {
    name: 'zora-web-embedded-fonts',
    setup(
      build: Parameters<
        NonNullable<Parameters<typeof Bun.build>[0]['plugins']>[number]['setup']
      >[0],
    ) {
      build.onLoad({ filter: /\.ttf$/ }, async (args) => {
        const font = await readFile(args.path);
        const dataUrl = `data:font/ttf;base64,${font.toString('base64')}`;
        return {
          contents: `export default ${JSON.stringify(dataUrl)};`,
          loader: 'js' as const,
        };
      });
    },
  };
}

/*** Alias React Native to React Native Web for standalone browser artifacts. */
function createWebPackageAliasPlugin() {
  return {
    name: 'zora-web-package-aliases',
    setup(
      build: Parameters<
        NonNullable<Parameters<typeof Bun.build>[0]['plugins']>[number]['setup']
      >[0],
    ) {
      build.onResolve({ filter: /^react-native$/ }, () => ({ path: reactNativeWebEntry }));
      build.onResolve({ filter: /^react-native-safe-area-context$/ }, () => ({
        path: safeAreaEntry,
      }));
    },
  };
}

/*** Prefer sibling .web modules throughout the standalone browser dependency graph. */
function createWebPlatformPlugin() {
  return {
    name: 'zora-web-platform-resolution',
    setup(
      build: Parameters<
        NonNullable<Parameters<typeof Bun.build>[0]['plugins']>[number]['setup']
      >[0],
    ) {
      build.onResolve({ filter: /^\./ }, async (args) => {
        const webPath = await resolveWebPlatformPath(args.resolveDir, args.path);
        return webPath === undefined ? undefined : { path: webPath };
      });
    },
  };
}

/*** Resolve a convention-based web sibling for one extensionless relative import. */
async function resolveWebPlatformPath(
  resolveDirectory: string,
  specifier: string,
): Promise<string | undefined> {
  if (/\.web\.[cm]?[jt]sx?$/.test(specifier)) return undefined;

  const extension = specifier.match(/\.[cm]?[jt]sx?$/)?.[0];
  const sourceSpecifier =
    extension === undefined ? specifier : specifier.slice(0, -extension.length);
  const basePath = join(resolveDirectory, sourceSpecifier);
  const candidates =
    extension === undefined
      ? [
          `${basePath}.web.tsx`,
          `${basePath}.web.ts`,
          `${basePath}.web.jsx`,
          `${basePath}.web.js`,
          join(basePath, 'index.web.tsx'),
          join(basePath, 'index.web.ts'),
          join(basePath, 'index.web.jsx'),
          join(basePath, 'index.web.js'),
        ]
      : [`${basePath}.web${extension}`];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  return undefined;
}

/*** Resolve the Bun loader for a rewritten TypeScript/JavaScript source file. */
function resolveBunLoader(path: string): 'js' | 'jsx' | 'ts' | 'tsx' {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.jsx')) return 'jsx';
  return 'js';
}

/*** Convert a relative filesystem path into a portable ESM module specifier. */
function toModuleSpecifier(path: string): string {
  const normalized = toPortablePath(path);
  return normalized.startsWith('.') ? normalized : `./${normalized}`;
}

/*** Check a platform candidate without leaking filesystem errors. */
async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
