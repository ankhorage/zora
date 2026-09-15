import { List as SurfaceList } from '@ankhorage/surface';
import React from 'react';

import type {
  ListItemProps,
  ListItemsProps,
  ListItemVariant,
  ListProps,
} from '../../../../types/list';
import { Divider, View } from '../../../layout/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
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
  const {
    themeId: _themeId,
    mode: _mode,
    interactionPolicy: _interactionPolicy,
    children,
    testID,
  } = props;
  return <SurfaceList testID={testID}>{children}</SurfaceList>;
}

/*** List composition built on the Surface list boundary with ZORA item/separator policy. */
export const List = withZoraThemeScope(ListInner);
