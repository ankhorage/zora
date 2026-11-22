import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';

import ts from 'typescript';

const repositoryRoot = resolve(import.meta.dir, '..');
const emittedRoots = [join(repositoryRoot, 'dist'), join(repositoryRoot, 'web-dist')];

type Replacement = Readonly<{
  end: number;
  start: number;
  value: string;
}>;

type SourceMap = Readonly<{
  file?: string;
  mappings: string;
  names?: readonly string[];
  sourceRoot?: string;
  sources: readonly string[];
  sourcesContent?: readonly (string | null)[];
  version: number;
}>;

type ColumnAdjustment = Readonly<{
  column: number;
  delta: number;
}>;

const base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/*** Normalize emitted relative module specifiers for Node's strict ESM resolver. */
async function normalizeNodeEsmImports(): Promise<void> {
  const emittedFiles = (await Promise.all(emittedRoots.map(collectEmittedModules))).flat();
  await Promise.all(emittedFiles.map(normalizeEmittedModule));
}

/*** Recursively collect JavaScript and declaration modules from one emitted package directory. */
async function collectEmittedModules(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectEmittedModules(path);
      return entry.isFile() && isEmittedModule(entry.name) ? [path] : [];
    }),
  );
  return paths.flat();
}

/*** Return whether a file is a generated runtime or TypeScript declaration module. */
function isEmittedModule(path: string): boolean {
  return path.endsWith('.js') || path.endsWith('.d.ts');
}

/*** Rewrite every emitted relative module specifier and retain its adjusted source map. */
async function normalizeEmittedModule(path: string): Promise<void> {
  const contents = await readFile(path, 'utf8');
  const sourceFile = ts.createSourceFile(
    path,
    contents,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('.d.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS,
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
  await normalizeSourceMap(path, normalizedContents, sourceFile, replacements);
}

/*** Shift generated source-map columns after an emitted module specifier grows. */
async function normalizeSourceMap(
  emittedPath: string,
  emittedContents: string,
  sourceFile: ts.SourceFile,
  replacements: readonly Replacement[],
): Promise<void> {
  const sourceMapPath = `${emittedPath}.map`;
  if (!(await pathExists(sourceMapPath))) return;
  const sourceMap = JSON.parse(await readFile(sourceMapPath, 'utf8')) as SourceMap;
  if (sourceMap.version !== 3 || !Array.isArray(sourceMap.sources)) {
    throw new Error(`Invalid source map for ${emittedPath}.`);
  }
  const columnAdjustments = createColumnAdjustments(sourceFile, replacements);
  const normalizedSourceMap: SourceMap = {
    ...sourceMap,
    mappings: encodeMappings(
      decodeMappings(sourceMap.mappings).map((line, lineIndex) =>
        line.map((segment) =>
          adjustGeneratedColumn(segment, columnAdjustments.get(lineIndex) ?? []),
        ),
      ),
    ),
  };
  await assertSourceMapIntegrity(emittedPath, emittedContents, normalizedSourceMap);
  await writeFile(sourceMapPath, `${JSON.stringify(normalizedSourceMap)}\n`, 'utf8');
}

/*** Verify generated and original positions remain valid after a module-specifier rewrite. */
async function assertSourceMapIntegrity(
  emittedPath: string,
  contents: string,
  sourceMap: SourceMap,
): Promise<void> {
  if (sourceMap.file !== basename(emittedPath)) {
    throw new Error(`Source map metadata does not match ${emittedPath}.`);
  }
  const generatedLines = contents.split('\n');
  const originalLines = await Promise.all(
    sourceMap.sources.map(async (source, index) => {
      const contents = sourceMap.sourcesContent?.[index];
      if (contents !== undefined && contents !== null) return contents.split('\n');
      return (
        await readFile(resolve(dirname(emittedPath), sourceMap.sourceRoot ?? '', source), 'utf8')
      ).split('\n');
    }),
  );
  for (const [generatedLine, segments] of decodeMappings(sourceMap.mappings).entries()) {
    for (const segment of segments) {
      const [generatedColumn, sourceIndex, sourceLine, sourceColumn] = segment;
      if (
        generatedColumn === undefined ||
        generatedColumn > (generatedLines[generatedLine]?.length ?? -1)
      ) {
        throw new Error(`Source map generated position is outside ${emittedPath}.`);
      }
      if (sourceIndex === undefined) continue;
      if (sourceLine === undefined || sourceColumn === undefined) {
        throw new Error(`Source map original position is incomplete for ${emittedPath}.`);
      }
      if (sourceColumn > (originalLines[sourceIndex]?.[sourceLine]?.length ?? -1)) {
        throw new Error(`Source map original position is outside ${emittedPath}.`);
      }
    }
  }
}

/*** Group generated-column shifts by line for efficient source-map adjustment. */
function createColumnAdjustments(
  sourceFile: ts.SourceFile,
  replacements: readonly Replacement[],
): ReadonlyMap<number, readonly ColumnAdjustment[]> {
  return replacements.reduce<ReadonlyMap<number, readonly ColumnAdjustment[]>>(
    (adjustments, replacement) => {
      const position = sourceFile.getLineAndCharacterOfPosition(replacement.end);
      const existing = adjustments.get(position.line) ?? [];
      return new Map(adjustments).set(position.line, [
        ...existing,
        {
          column: position.character,
          delta: replacement.value.length - (replacement.end - replacement.start),
        },
      ]);
    },
    new Map(),
  );
}

/*** Shift one source-map segment by every replacement that precedes it on its generated line. */
function adjustGeneratedColumn(
  segment: readonly number[],
  replacements: readonly ColumnAdjustment[],
): readonly number[] {
  const [generatedColumn, ...fields] = segment;
  if (generatedColumn === undefined) throw new Error('Source-map segment has no generated column.');
  const offset = replacements.reduce(
    (total, replacement) =>
      generatedColumn >= replacement.column ? total + replacement.delta : total,
    0,
  );
  return [generatedColumn + offset, ...fields];
}

/*** Decode a version-3 source-map mapping string into absolute generated positions. */
function decodeMappings(mappings: string): readonly (readonly (readonly number[])[])[] {
  let generatedColumn = 0;
  let source = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let name = 0;
  return mappings.split(';').map((line) => {
    generatedColumn = 0;
    return line === ''
      ? []
      : line.split(',').map((encodedSegment) => {
          const values = decodeVlq(encodedSegment);
          const [generatedColumnDelta, sourceDelta, sourceLineDelta, sourceColumnDelta, nameDelta] =
            values;
          if (generatedColumnDelta === undefined)
            throw new Error('Source-map segment has no generated column.');
          generatedColumn += generatedColumnDelta;
          if (values.length === 1) return [generatedColumn];
          if (
            sourceDelta === undefined ||
            sourceLineDelta === undefined ||
            sourceColumnDelta === undefined
          ) {
            throw new Error('Source-map segment has incomplete original source data.');
          }
          source += sourceDelta;
          sourceLine += sourceLineDelta;
          sourceColumn += sourceColumnDelta;
          if (nameDelta === undefined) return [generatedColumn, source, sourceLine, sourceColumn];
          name += nameDelta;
          return [generatedColumn, source, sourceLine, sourceColumn, name];
        });
  });
}

/*** Encode absolute source-map positions as a version-3 mapping string. */
function encodeMappings(lines: readonly (readonly (readonly number[])[])[]): string {
  let source = 0;
  let sourceLine = 0;
  let sourceColumn = 0;
  let name = 0;
  return lines
    .map((line) => {
      let generatedColumn = 0;
      return line
        .map((segment) => {
          const [nextGeneratedColumn, nextSource, nextSourceLine, nextSourceColumn, nextName] =
            segment;
          if (nextGeneratedColumn === undefined)
            throw new Error('Source-map segment has no generated column.');
          const encodedValues = [nextGeneratedColumn - generatedColumn];
          generatedColumn = nextGeneratedColumn;
          if (nextSource === undefined) return encodeVlq(encodedValues);
          if (nextSourceLine === undefined || nextSourceColumn === undefined) {
            throw new Error('Source-map segment has incomplete original source data.');
          }
          encodedValues.push(
            nextSource - source,
            nextSourceLine - sourceLine,
            nextSourceColumn - sourceColumn,
          );
          source = nextSource;
          sourceLine = nextSourceLine;
          sourceColumn = nextSourceColumn;
          if (nextName === undefined) return encodeVlq(encodedValues);
          encodedValues.push(nextName - name);
          name = nextName;
          return encodeVlq(encodedValues);
        })
        .join(',');
    })
    .join(';');
}

/*** Decode one base64-VLQ source-map segment. */
function decodeVlq(value: string): readonly number[] {
  const values: number[] = [];
  let currentValue = 0;
  let shift = 0;
  for (const character of value) {
    const digit = base64Characters.indexOf(character);
    if (digit === -1) throw new Error(`Invalid base64-VLQ character ${character}.`);
    currentValue += (digit & 31) << shift;
    if ((digit & 32) === 0) {
      values.push((currentValue & 1) === 1 ? -(currentValue >> 1) : currentValue >> 1);
      currentValue = 0;
      shift = 0;
    } else {
      shift += 5;
    }
  }
  if (shift !== 0) throw new Error(`Incomplete base64-VLQ value ${value}.`);
  return values;
}

/*** Encode one base64-VLQ source-map segment. */
function encodeVlq(values: readonly number[]): string {
  return values
    .map((value) => {
      let encoded = value < 0 ? (-value << 1) | 1 : value << 1;
      let result = '';
      do {
        const digit = encoded & 31;
        encoded >>>= 5;
        result += base64Characters[digit + (encoded === 0 ? 0 : 32)];
      } while (encoded !== 0);
      return result;
    })
    .join('');
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
    if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    ) {
      specifiers.push(node.argument.literal);
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
  const moduleRoot = resolve(dirname(emittedPath), specifier);
  const declaration = emittedPath.endsWith('.d.ts');
  const fileTargets = declaration
    ? [`${moduleRoot}.js`, `${moduleRoot}.d.ts`]
    : [`${moduleRoot}.js`];
  if (await somePathExists(fileTargets)) return `${specifier}.js`;
  if (extname(specifier) !== '') {
    throw new Error(
      `Cannot resolve emitted relative module specifier ${specifier} from ${emittedPath}.`,
    );
  }
  const indexTargets = declaration
    ? [join(moduleRoot, 'index.js'), join(moduleRoot, 'index.d.ts')]
    : [join(moduleRoot, 'index.js')];
  if (await somePathExists(indexTargets)) return `${specifier}/index.js`;
  throw new Error(
    `Cannot resolve emitted relative module specifier ${specifier} from ${emittedPath}.`,
  );
}

/*** Return whether at least one emitted runtime or declaration target exists. */
async function somePathExists(paths: readonly string[]): Promise<boolean> {
  return (await Promise.all(paths.map(pathExists))).some(Boolean);
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
