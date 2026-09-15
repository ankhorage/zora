import './migrate-zora-430';

import { readFile, writeFile } from 'node:fs/promises';

async function replaceAll(path: string, from: string, to: string) {
  const source = await readFile(path, 'utf8');
  const next = source.replaceAll(from, to);
  if (next !== source) await writeFile(path, next);
}

await writeFile(
  'src/features/list/public.ts',
  `export type {
  ManifestListProps,
  ManifestListSection,
  ManifestSectionListProps,
} from '../../types/manifest-list';
export type {
  ListChildrenProps,
  ListItemProps,
  ListItemsProps,
  ListItemVariant,
  ListProps,
  ListSectionProps,
} from '../../types/list';
export { FlatList } from './adapters/inbound/FlatList';
export { List } from './adapters/inbound/List';
export { ListItem } from './adapters/inbound/ListItem';
export { ListSection } from './adapters/inbound/ListSection';
export { SectionList } from './adapters/inbound/SectionList';
`,
);

await replaceAll(
  'src/metadata/componentMeta.ts',
  "from '../features/form/fieldMeta';",
  "from '../features/form/field/meta';",
);
await replaceAll(
  'src/metadata/componentMeta.ts',
  "from '../patterns/list/meta';",
  "from '../features/list/meta';",
);
await replaceAll('src/index.ts', "from './patterns/list';", "from './features/list/public';");
await replaceAll('src/registry.ts', "from './patterns/list';", "from './features/list/public';");

await replaceAll(
  'src/features/form/public.ts',
  "export { Field } from './adapters/inbound/Field';",
  "export { Field } from './field/public';",
);
