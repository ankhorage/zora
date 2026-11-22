import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

import ts from 'typescript';

const repositoryRoot = resolve(import.meta.dir, '..');
const emittedRoots = [join(repositoryRoot, 'dist'), join(repositoryRoot, 'web-dist')];

type Replacement = Readonly<{
  end: number;
  start: number;
  value: string;
}>;

/*** Normalize emitted relative module specifiers for Node's strict ESM resolver. */
async function normalizeNodeEsmImports(): Promise<void> {
  const emittedFiles = (await Promise.all(emittedRoots.map(collectJavaScriptFiles))).flat();
  await Promise.all(emittedFiles.map(normalizeJavaScriptFile));
}

/*** Recursively collect JavaScript modules from one emitted package directory. */
async function collectJavaScriptFiles(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectJavaScriptFiles(path);
      return entry.isFile() && extname(entry.name) === '.js' ? [path] : [];
    }),
  );
  return paths.flat();
}

/*** Rewrite every emitted relative module specifier to an explicit JavaScript target. */
async function normalizeJavaScriptFile(path: string): Promise<void> {
  const contents = await readFile(path, 'utf8');
  const sourceFile = ts.createSourceFile(
    path,
    contents,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const replacements = await collectSpecifierReplacements(path, sourceFile);
  if (replacements.length === 0) return;
  const normalizedContents = [...replacements]
    .sort((left, right) => right.start - left.start)
    .reduce(
      (result, replacement) =>
        `${result.slice(0, replacement.start)}${replacement.value}${result.slice(replacement.end)}`,
      contents,
    );
  await writeFile(path, normalizedContents, 'utf8');
}

/*** Find module specifiers that Node ESM requires to name with a file extension. */
async function collectSpecifierReplacements(
  emittedPath: string,
  sourceFile: ts.SourceFile,
): Promise<readonly Replacement[]> {
  const specifiers = collectModuleSpecifiers(sourceFile);
  return Promise.all(
    specifiers.map(async (specifier) => {
      const normalizedSpecifier = await resolveNodeEsmSpecifier(emittedPath, specifier.text);
      if (normalizedSpecifier === specifier.text) return undefined;
      return {
        start: specifier.getStart(sourceFile) + 1,
        end: specifier.getEnd() - 1,
        value: normalizedSpecifier,
      };
    }),
  ).then((replacements) =>
    replacements.filter((replacement): replacement is Replacement => replacement !== undefined),
  );
}

/*** Collect static and dynamic module specifiers without changing ordinary string literals. */
function collectModuleSpecifiers(sourceFile: ts.SourceFile): readonly ts.StringLiteral[] {
  const specifiers: ts.StringLiteral[] = [];
  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier);
    }
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1
    ) {
      const [argument] = node.arguments;
      if (argument !== undefined && ts.isStringLiteral(argument)) specifiers.push(argument);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return specifiers;
}

/*** Resolve an extensionless emitted relative specifier or reject an invalid package artifact. */
async function resolveNodeEsmSpecifier(emittedPath: string, specifier: string): Promise<string> {
  if (
    !specifier.startsWith('.') ||
    specifier.endsWith('.js') ||
    specifier.endsWith('.json') ||
    specifier.endsWith('.node')
  ) {
    return specifier;
  }
  const fileTarget = `${resolve(dirname(emittedPath), specifier)}.js`;
  if (await pathExists(fileTarget)) return `${specifier}.js`;
  if (extname(specifier) !== '') {
    throw new Error(
      `Cannot resolve emitted relative module specifier ${specifier} from ${emittedPath}.`,
    );
  }
  const indexTarget = join(resolve(dirname(emittedPath), specifier), 'index.js');
  if (await pathExists(indexTarget)) return `${specifier}/index.js`;
  throw new Error(
    `Cannot resolve emitted relative module specifier ${specifier} from ${emittedPath}.`,
  );
}

/*** Return whether an emitted target exists without swallowing unrelated failures. */
async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

await normalizeNodeEsmImports();
