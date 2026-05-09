import React from 'react';

import { Divider, Spacer, Stack } from '../../foundation';
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

function ListItemsInner({
  themeId: _themeId,
  mode: _mode,
  testID,
  items,
  rowVariant = 'divider',
  compact,
}: ListItemsProps) {
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
