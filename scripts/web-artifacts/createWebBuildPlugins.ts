import { access, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const reactNativeWebEntry = require.resolve('react-native-web');
const safeAreaPackageRoot = dirname(require.resolve('react-native-safe-area-context/package.json'));
const safeAreaPackage = require('react-native-safe-area-context/package.json') as {
  readonly module?: string;
};
const safeAreaEntry = join(safeAreaPackageRoot, safeAreaPackage.module ?? 'lib/module/index.js');
const SURFACE_WEB_IMPORTS = new Set([
  '@ankhorage/surface',
  '@ankhorage/surface/authoring-controls',
  '@ankhorage/surface/bottom-sheet',
  '@ankhorage/surface/color',
  '@ankhorage/surface/theme',
]);

/*** Resolve Surface's root and browser-adjacent public boundaries to its single web contract. */
function resolveSurfaceWebSpecifier(specifier: string): string | undefined {
  return SURFACE_WEB_IMPORTS.has(specifier) ? '@ankhorage/surface/web' : undefined;
}

/*** Rewrite only the declared Surface browser boundaries without affecting unrelated package imports. */
export function rewriteSurfaceWebSpecifiers(source: string): string {
  return source.replaceAll(
    /@ankhorage\/surface(?:\/(?:authoring-controls|bottom-sheet|color|theme))?/gu,
    (specifier) => resolveSurfaceWebSpecifier(specifier) ?? specifier,
  );
}

/*** Create portable resolution plugins for standalone React Native Web artifacts. */
export function createWebBuildPlugins() {
  return [
    createSurfaceWebBoundaryPlugin(),
    createEmbeddedFontPlugin(),
    createWebPackageAliasPlugin(),
    createWebPlatformPlugin(),
  ];
}

/*** Keep browser artifacts on Surface's published web contracts without source-module rewrites. */
function createSurfaceWebBoundaryPlugin() {
  return {
    name: 'zora-surface-web-boundary',
    setup(
      build: Parameters<
        NonNullable<Parameters<typeof Bun.build>[0]['plugins']>[number]['setup']
      >[0],
    ) {
      build.onResolve({ filter: /^@ankhorage\/surface(?:\/.+)?$/ }, (args) => {
        const path = resolveSurfaceWebSpecifier(args.path);
        return path === undefined ? undefined : { path, external: true };
      });
    },
  };
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
