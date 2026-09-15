import { readFile, writeFile } from 'node:fs/promises';

async function replaceInFile(path: string, replacements: readonly (readonly [string, string])[]) {
  const original = await readFile(path, 'utf8');
  const updated = replacements.reduce((content, [from, to]) => {
    if (!content.includes(from)) throw new Error(`Missing replacement marker in ${path}: ${from}`);
    return content.replace(from, to);
  }, original);
  await writeFile(path, updated);
}

await replaceInFile('src/features/form/field/public.ts', [
  ["export type { FieldProps } from '../../../types/form';\n", ''],
]);

await replaceInFile('src/index.ts', [
  [
    "  ListItemVariant,\n  ListProps,\n} from './features/list/public';",
    "  ListItemVariant,\n  ListProps,\n  ListSectionProps,\n} from './features/list/public';",
  ],
]);

await replaceInFile('src/theme/themeScopeStructure.test.ts', [
  [
    "join(srcDir, 'features', 'form', 'adapters', 'inbound', 'Field.tsx')",
    "join(srcDir, 'features', 'form', 'field', 'adapters', 'inbound', 'Field.tsx')",
  ],
  [
    "join(srcDir, 'patterns', 'list', 'List.tsx')",
    "join(srcDir, 'features', 'list', 'adapters', 'inbound', 'List.tsx')",
  ],
  [
    "join(srcDir, 'patterns', 'list', 'ListItem.tsx')",
    "join(srcDir, 'features', 'list', 'adapters', 'inbound', 'ListItem.tsx')",
  ],
  [
    "join(srcDir, 'patterns', 'list', 'ListSection.tsx')",
    "join(srcDir, 'features', 'list', 'adapters', 'inbound', 'ListSection.tsx')",
  ],
  ["join(srcDir, 'patterns', 'list', 'types.ts')", "join(srcDir, 'types', 'list.ts')"],
]);

await replaceInFile('src/features/bottom-sheet/public.test.ts', [
  ["toMatch(/^\\^6\\./u)", "toMatch(/^\\^7\\./u)"],
]);
