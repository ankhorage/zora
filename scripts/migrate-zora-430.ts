import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const textExtensions = new Set(['.ts', '.tsx']);

async function collectFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);
      if (entry.isDirectory()) return collectFiles(path);
      return textExtensions.has(extname(entry.name)) ? [path] : [];
    }),
  );
  return nested.flat();
}

async function replaceInFile(path: string, replacements: readonly [RegExp | string, string][]) {
  const source = await readFile(path, 'utf8');
  const next = replacements.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    source,
  );
  if (next !== source) await writeFile(path, next);
}

async function write(path: string, content: string) {
  const parts = path.split('/');
  await mkdir(parts.slice(0, -1).join('/'), { recursive: true });
  await writeFile(path, content);
}

const files = [...(await collectFiles('src')), ...(await collectFiles('examples'))];
const symbolReplacements = [
  [/\bFormFieldProps\b/gu, 'FieldProps'],
  [/\bformFieldMeta\b/gu, 'fieldMeta'],
  [/\bFormField\b/gu, 'Field'],
  [/\bListRowProps\b/gu, 'ListItemProps'],
  [/\bListRowVariant\b/gu, 'ListItemVariant'],
  [/\blistRowMeta\b/gu, 'listItemMeta'],
  [/\browVariant\b/gu, 'itemVariant'],
  [/\bListRow\b/gu, 'ListItem'],
] as const;

for (const file of files) await replaceInFile(file, symbolReplacements);

const pathReplacements = [
  ['src/features/form/adapters/inbound/Field.tsx', 'src/features/form/field/adapters/inbound/Field.tsx'],
  ['src/features/form/formFieldMeta.ts', 'src/features/form/field/meta.ts'],
  ['src/patterns/list/List.tsx', 'src/features/list/adapters/inbound/List.tsx'],
  ['src/patterns/list/ListItem.tsx', 'src/features/list/adapters/inbound/ListItem.tsx'],
  ['src/patterns/list/ListSection.tsx', 'src/features/list/adapters/inbound/ListSection.tsx'],
  ['src/patterns/list/index.ts', 'src/features/list/public.ts'],
  ['src/patterns/list/meta.ts', 'src/features/list/meta.ts'],
  ['src/patterns/list/types.ts', 'src/types/list.ts'],
] as const;
for (const file of files) {
  await replaceInFile(
    file,
    pathReplacements.map(([from, to]) => [from, to] as const),
  );
}

await replaceInFile('src/features/form/public.ts', [
  ["export { Field } from './adapters/inbound/FormField';", "export { Field } from './field/public';"],
  ["export { Field } from './adapters/inbound/Field';", "export { Field } from './field/public';"],
]);
await replaceInFile('src/index.ts', [["from './patterns/list';", "from './features/list/public';"]]);
await replaceInFile('src/registry.ts', [["from './patterns/list';", "from './features/list/public';"]]);
await replaceInFile('src/metadata/componentMeta.ts', [
  ["from '../features/form/formFieldMeta';", "from '../features/form/field/meta';"],
  ["from '../patterns/list/meta';", "from '../features/list/meta';"],
]);
await replaceInFile('src/patterns/tree-view/TreeItem.tsx', [
  ["from '../list';", "from '../../features/list/public';"],
]);
await replaceInFile('src/patterns/switch-field/SwitchField.tsx', [
  ["from '../list';", "from '../../features/list/public';"],
]);
await replaceInFile('src/features/skeleton/adapters/inbound/SkeletonList.tsx', [
  ["from '../../../../patterns/list';", "from '../../../list/public';"],
]);

await write(
  'src/features/form/field/adapters/inbound/Field.tsx',
  `import { Field as SurfaceField } from '@ankhorage/surface';
import React from 'react';

import { withZoraThemeScope } from '../../../../../theme/withZoraThemeScope';
import type { FieldProps } from '../../../../../types/form';
import { View } from '../../../../layout/public';
import { Text } from '../../../../typography/public';

function FieldInner({
  themeId: _themeId,
  mode: _mode,
  label,
  description,
  helperText,
  children,
  interactionPolicy: _interactionPolicy,
  ...props
}: FieldProps) {
  return (
    <SurfaceField
      {...props}
      helperText={helperText}
      label={
        <View gap="xs">
          <Text variant="label" weight="semiBold">
            {label}
          </Text>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
        </View>
      }
    >
      {children}
    </SurfaceField>
  );
}

/*** Groups one form control with its label, description, helper text, and field error. */
export const Field = withZoraThemeScope(FieldInner);
`,
);
await write(
  'src/features/form/field/public.ts',
  `export type { FieldProps } from '../../../types/form';
export { Field } from './adapters/inbound/Field';
`,
);
await write(
  'src/features/form/field/meta.ts',
  `import type { ZoraComponentMeta } from '../../../metadata';

export const fieldMeta = {
  name: 'Field',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [
    'Checkbox',
    'CheckboxGroup',
    'RadioGroup',
    'SearchInput',
    'Select',
    'TextInput',
  ],
  blueprint: { label: 'Field', defaultProps: { label: 'Label' } },
  bindings: {
    props: {
      errorText: {
        label: 'Error text',
        description: 'Field-level validation error.',
        value: { type: 'unknown' },
        acceptsFallback: true,
      },
      disabled: {
        label: 'Disabled',
        description: 'Whether the field is disabled.',
        value: { type: 'boolean' },
        acceptsFallback: true,
        acceptsTransforms: true,
      },
    },
  },
  props: {
    label: { type: 'string', category: 'Content', label: 'Label', default: 'Label' },
    description: { type: 'string', category: 'Content', label: 'Description' },
    helperText: { type: 'string', category: 'Content', label: 'Helper text' },
    errorText: { type: 'string', category: 'Validation', label: 'Error text' },
    required: { type: 'boolean', category: 'Validation', label: 'Required', default: false },
    invalid: { type: 'boolean', category: 'Validation', label: 'Invalid', default: false },
    disabled: { type: 'boolean', category: 'State', label: 'Disabled', default: false },
    readOnly: { type: 'boolean', category: 'State', label: 'Read-only', default: false },
  },
} as const satisfies ZoraComponentMeta;
`,
);

await write(
  'src/types/list.ts',
  `import type { ListItemProps as SurfaceListItemProps } from '@ankhorage/surface';
import type React from 'react';

import type { ZoraBaseProps } from '../theme/ZoraBaseProps';

export type ListItemVariant = 'divider' | 'card';

interface ListItemBaseProps
  extends
    ZoraBaseProps,
    Pick<SurfaceListItemProps, 'compact' | 'disabled' | 'leading' | 'selected' | 'trailing'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  variant?: ListItemVariant;
}

interface ListItemPressableProps {
  onPress: () => void;
  action?: never;
}

interface ListItemActionProps {
  action: React.ReactNode;
  onPress?: never;
}

interface ListItemStaticProps {
  action?: never;
  onPress?: never;
}

export type ListItemProps = ListItemBaseProps &
  (ListItemPressableProps | ListItemActionProps | ListItemStaticProps);

export interface ListItemsProps extends ZoraBaseProps {
  items: readonly ListItemProps[];
  itemVariant?: ListItemVariant;
  compact?: boolean;
}

export interface ListChildrenProps extends ZoraBaseProps {
  children: React.ReactNode;
}

export type ListProps = ListItemsProps | ListChildrenProps;

interface ListSectionItemsProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  items: readonly ListItemProps[];
  itemVariant?: ListItemVariant;
  compact?: boolean;
}

interface ListSectionChildrenProps extends ZoraBaseProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export type ListSectionProps = ListSectionItemsProps | ListSectionChildrenProps;
`,
);
await write(
  'src/features/list/adapters/inbound/ListItem.tsx',
  `import { ListItem as SurfaceListItem } from '@ankhorage/surface';
import React from 'react';

import { useZoraTheme } from '../../../../theme/useZoraTheme';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ListItemProps, ListItemVariant } from '../../../../types/list';
import { View } from '../../../layout/public';
import { Text } from '../../../typography/public';

function ListItemInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  interactionPolicy,
  title,
  description,
  meta,
  leading,
  trailing,
  action,
  onPress,
  selected = false,
  disabled = false,
  compact = false,
  variant = 'divider',
}: ListItemProps) {
  const { theme } = useZoraTheme();
  const trailingContent = renderTrailing(trailing, action);

  return (
    <View
      bg={variant === 'card' ? theme.semantics.surface.raised : 'transparent'}
      borderColor={
        selected
          ? theme.semantics.border.focus
          : variant === 'card'
            ? theme.semantics.border.default
            : 'transparent'
      }
      borderWidth={variant === 'card' || selected ? 1 : 0}
      overflow="hidden"
      radius={resolveRadius(variant)}
    >
      <SurfaceListItem
        compact={compact}
        disabled={disabled}
        interactionPolicy={interactionPolicy}
        leading={leading}
        onPress={action ? undefined : onPress}
        selected={selected}
        testID={testID}
        trailing={trailingContent}
      >
        <View gap="xxs">
          <Text variant="body" weight={selected ? 'semiBold' : 'medium'}>
            {title}
          </Text>
          {description ? (
            <Text emphasis="muted" variant="bodySmall">
              {description}
            </Text>
          ) : null}
          {meta ? (
            <Text emphasis="subtle" variant="caption">
              {meta}
            </Text>
          ) : null}
        </View>
      </SurfaceListItem>
    </View>
  );
}

function resolveRadius(variant: ListItemVariant) {
  return variant === 'card' ? ('l' as const) : ('m' as const);
}

function renderTrailing(trailing: React.ReactNode, action: React.ReactNode) {
  if (!trailing && !action) return undefined;
  return (
    <View align="center" direction="row" gap="s" wrap="nowrap">
      {trailing}
      {action}
    </View>
  );
}

/*** Opinionated list item built on the Surface list-item interaction and geometry boundary. */
export const ListItem = withZoraThemeScope(ListItemInner);
`,
);
await write(
  'src/features/list/adapters/inbound/List.tsx',
  `import { List as SurfaceList } from '@ankhorage/surface';
import React from 'react';

import { Divider, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ListItemProps, ListItemVariant, ListItemsProps, ListProps } from '../../../../types/list';
import { resolveListSeparator } from '../../utils/resolveListSeparator';
import { ListItem } from './ListItem';

function resolveItemVariant({
  item,
  defaultVariant,
}: {
  item: ListItemProps;
  defaultVariant: ListItemVariant;
}): ListItemVariant {
  return item.variant ?? defaultVariant;
}

function resolveItemCompact({
  item,
  compact,
}: {
  item: ListItemProps;
  compact: boolean | undefined;
}): boolean {
  return item.compact ?? compact ?? false;
}

function ListItemsInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  itemVariant = 'divider',
  compact,
}: ListItemsProps) {
  return (
    <SurfaceList testID={testID}>
      {items.map((item, index) => {
        const effectiveVariant = resolveItemVariant({ item, defaultVariant: itemVariant });
        const separator = resolveListSeparator(effectiveVariant, index);
        return (
          <React.Fragment key={String(index)}>
            {separator === 'divider' ? <Divider /> : null}
            {separator === 'spacer' ? <View height="s" /> : null}
            <ListItem
              {...item}
              compact={resolveItemCompact({ item, compact })}
              variant={effectiveVariant}
            />
          </React.Fragment>
        );
      })}
    </SurfaceList>
  );
}

function ListInner(props: ListProps) {
  if ('items' in props) return <ListItemsInner {...props} />;
  const { themeId: _themeId, mode: _mode, interactionPolicy: _interactionPolicy, children, testID } = props;
  return <SurfaceList testID={testID}>{children}</SurfaceList>;
}

/*** List composition built on the Surface list boundary with ZORA item/separator policy. */
export const List = withZoraThemeScope(ListInner);
`,
);
await write(
  'src/features/list/adapters/inbound/ListSection.tsx',
  `import React from 'react';

import { SectionHeader } from '../../../../patterns/section-header';
import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ListSectionProps } from '../../../../types/list';
import { View } from '../../../layout/public';
import { List } from './List';

function ListSectionInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  title,
  description,
  eyebrow,
  actions,
  ...props
}: ListSectionProps) {
  const hasHeader = title !== undefined;
  return (
    <View gap="s" testID={testID}>
      {hasHeader ? (
        <SectionHeader actions={actions} description={description} eyebrow={eyebrow} title={title} />
      ) : null}
      <List {...props} />
    </View>
  );
}

/*** Section wrapper for lists with optional ZORA section-heading semantics. */
export const ListSection = withZoraThemeScope(ListSectionInner);
`,
);
await write(
  'src/features/list/utils/resolveListSeparator.ts',
  `import type { ListItemVariant } from '../../../types/list';

export type ListSeparatorKind = 'none' | 'divider' | 'spacer';

/*** Resolves the separator preceding an item for the active list presentation. */
export function resolveListSeparator(variant: ListItemVariant, index: number): ListSeparatorKind {
  if (index === 0) return 'none';
  return variant === 'divider' ? 'divider' : 'spacer';
}
`,
);
await write(
  'src/features/list/public.ts',
  `export type {
  ListChildrenProps,
  ListItemProps,
  ListItemsProps,
  ListItemVariant,
  ListProps,
  ListSectionProps,
} from '../../types/list';
export { List } from './adapters/inbound/List';
export { ListItem } from './adapters/inbound/ListItem';
export { ListSection } from './adapters/inbound/ListSection';
`,
);
await write(
  'src/features/list/meta.ts',
  `import type { ZoraComponentMeta } from '../../metadata';

const LIST_NOTE = 'List feature component; collection authoring is represented through List metadata.';

export const listMeta = {
  name: 'List',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;

export const listItemMeta = {
  name: 'ListItem',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  events: {
    itemPress: {
      label: 'Item press',
      eventType: 'collection.itemPress',
      description: 'Emitted when a collection item is selected.',
      payloadFields: [
        { path: 'payload.itemId', type: 'string', label: 'Item ID' },
        { path: 'payload.item', type: 'record', label: 'Item' },
      ],
    },
  },
  props: {},
} as const satisfies ZoraComponentMeta;

export const listSectionMeta = {
  name: 'ListSection',
  category: 'pattern',
  directManifestNode: false,
  allowedChildren: [],
  note: LIST_NOTE,
  props: {},
} as const satisfies ZoraComponentMeta;
`,
);

await rm('src/features/form/adapters/inbound/FormField.tsx', { force: true });
await rm('src/features/form/formFieldMeta.ts', { force: true });
await rm('src/patterns/list', { force: true, recursive: true });

const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as {
  dependencies: Record<string, string>;
};
packageJson.dependencies['@ankhorage/surface'] = '^7.0.0';
await writeFile('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

await mkdir('.changeset', { recursive: true });
await writeFile(
  '.changeset/surface-7-form-list.md',
  `---\n'@ankhorage/zora': major\n---\n\nAlign form and list capabilities with Surface 7. Rename FormField to Field and ListRow to ListItem, move list ownership into src/features/list, and compose Surface Field, List, and ListItem directly without compatibility aliases.\n`,
);
