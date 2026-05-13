import React from 'react';

import { Divider, Grid, Spacer, Stack } from '../../foundation';
import { withZoraThemeScope } from '../../theme/withZoraThemeScope';
import { ListRow } from './ListRow';
import { resolveListSeparator } from './resolveListSeparator';
import type { ListItemsProps, ListProps, ListRowProps, ListRowVariant } from './types';

function resolveRowVariant({
  item,
  defaultVariant,
}: {
  item: ListRowProps;
  defaultVariant: ListRowVariant;
}): ListRowVariant {
  return item.variant ?? defaultVariant;
}

function resolveRowCompact({
  item,
  compact,
}: {
  item: ListRowProps;
  compact: boolean | undefined;
}): boolean {
  return item.compact ?? compact ?? false;
}

function resolveCardGridColumns(cols: ListItemsProps['columns']): ListItemsProps['columns'] {
  return cols ?? { base: 1, md: 2, xl: 3 };
}

function resolveCardGridGap(gap: ListItemsProps['gap']): ListItemsProps['gap'] {
  return gap ?? 's';
}

function shouldRenderGrid({
  items,
  rowVariant,
}: {
  items: readonly ListRowProps[];
  rowVariant: ListRowVariant;
}): boolean {
  return items.every((item) => resolveRowVariant({ item, defaultVariant: rowVariant }) === 'card');
}

function ListItemsInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  rowVariant = 'divider',
  compact,
  columns,
  gap,
  minItemWidth,
}: ListItemsProps) {
  if (shouldRenderGrid({ items, rowVariant })) {
    return (
      <Grid
        cols={resolveCardGridColumns(columns)}
        gap={resolveCardGridGap(gap)}
        minItemWidth={minItemWidth}
        testID={testID}
      >
        {items.map((item, index) => (
          <ListRow
            {...item}
            compact={resolveRowCompact({ item, compact })}
            key={`${index}`}
            variant={resolveRowVariant({ item, defaultVariant: rowVariant })}
          />
        ))}
      </Grid>
    );
  }

  return (
    <Stack gap="none" testID={testID}>
      {items.map((item, index) => {
        const effectiveVariant = resolveRowVariant({ item, defaultVariant: rowVariant });
        const separator = resolveListSeparator(effectiveVariant, index);

        return (
          <React.Fragment key={`${index}`}>
            {separator === 'divider' ? <Divider /> : null}
            {separator === 'spacer' ? <Spacer size="s" /> : null}
            <ListRow
              {...item}
              compact={resolveRowCompact({ item, compact })}
              variant={effectiveVariant}
            />
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

function ListInner(props: ListProps) {
  if ('items' in props) {
    return <ListItemsInner {...props} />;
  }

  const { themeId: _themeId, mode: _mode, children, testID } = props;
  return (
    <Stack gap="none" testID={testID}>
      {children}
    </Stack>
  );
}

export const List = withZoraThemeScope(ListInner);
