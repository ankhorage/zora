import React from 'react';

import type { AuthoringSelectionAdapterProps } from '../../../../types/authoring-adapters';
import { SelectionProvider, useSelection } from '../../../selection/public';

/*** Connects consumer-owned items to ZORA's controlled single-selection behavior. */
export function AuthoringSelectionAdapter<TItem>({
  items,
  selectedItemId,
  getItemId,
  onSelectionChange,
  renderItem,
  disabled,
}: AuthoringSelectionAdapterProps<TItem>) {
  return (
    <SelectionProvider
      disabled={disabled}
      mode="single"
      selectedIds={selectedItemId === undefined ? [] : [selectedItemId]}
      onSelectionChange={(ids) => {
        const [selectedId] = ids;
        onSelectionChange?.(items.find((item) => getItemId(item) === selectedId) ?? null);
      }}
    >
      {items.map((item) => (
        <AuthoringSelectionItem
          getItemId={getItemId}
          item={item}
          key={getItemId(item)}
          renderItem={renderItem}
        />
      ))}
    </SelectionProvider>
  );
}

/*** Maps the canonical selection engine state onto one consumer-owned authoring item. */
function AuthoringSelectionItem<TItem>({
  item,
  getItemId,
  renderItem,
}: Pick<AuthoringSelectionAdapterProps<TItem>, 'getItemId' | 'renderItem'> & {
  readonly item: TItem;
}) {
  const selection = useSelection();
  const id = getItemId(item);

  return renderItem({
    item,
    selected: selection.isSelected(id),
    disabled: selection.disabled,
    select: () => selection.select(id),
  });
}
