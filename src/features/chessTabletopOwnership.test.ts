import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, parse } from 'node:path';

import { expect, test } from 'bun:test';
import * as ts from 'typescript';

const featureRoots = ['src/features/chess', 'src/features/tabletop'] as const;

test('Chess and Tabletop implementation modules own one matching runtime export each', () => {
  for (const featureRoot of featureRoots) {
    for (const directory of [join(featureRoot, 'adapters/inbound'), join(featureRoot, 'utils')]) {
      for (const name of readdirSync(directory)) {
        if (!['.ts', '.tsx'].includes(extname(name)) || name.includes('.test.')) continue;
        const source = ts.createSourceFile(
          name,
          readFileSync(join(directory, name), 'utf8'),
          ts.ScriptTarget.Latest,
          true,
        );
        const runtimeExports = source.statements.flatMap((statement) => {
          if (
            !ts.canHaveModifiers(statement) ||
            !ts
              .getModifiers(statement)
              ?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
          )
            return [];
          if (ts.isFunctionDeclaration(statement) && statement.name) return [statement.name.text];
          if (ts.isVariableStatement(statement))
            return statement.declarationList.declarations.map((declaration) =>
              declaration.name.getText(source),
            );
          return [];
        });
        const expectedExports =
          name === 'chessEngine.ts'
            ? ['getLegalTargets', 'readChessPieces', 'tryMove']
            : [parse(name).name];
        expect(runtimeExports.sort(), join(directory, name)).toEqual(expectedExports.sort());
      }
    }
  }
});

test('Chess and Tabletop source graphs depend only on their intentional runtime owners', () => {
  const sourcePaths = featureRoots.flatMap((featureRoot) => {
    const visit = (directory: string): string[] =>
      readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return visit(path);
        return /\.(?:ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.') ? [path] : [];
      });
    return visit(featureRoot);
  });
  for (const path of sourcePaths) {
    const source = ts.createSourceFile(
      path,
      readFileSync(path, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    const imports = source.statements
      .filter(ts.isImportDeclaration)
      .map((statement) => statement.moduleSpecifier)
      .filter(ts.isStringLiteral)
      .map((literal) => literal.text);
    for (const specifier of imports) {
      if (specifier.startsWith('.')) continue;
      expect(
        ['react', 'react-native', 'chess.js', '@ankhorage/color-theory'],
        `${path}: ${specifier}`,
      ).toContain(specifier);
    }
  }
});
