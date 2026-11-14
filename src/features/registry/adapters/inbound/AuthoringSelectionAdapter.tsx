import React from 'react';

import type { AuthoringSelectionAdapterProps } from '../../../../types/authoring-adapters';
import { SelectableItem, SelectionProvider } from '../../../selection/public';

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
      {items.map((item) => {
        const id = getItemId(item);
        return (
          <SelectableItem key={id} id={id} trigger="press">
            {(state) =>
              renderItem({
                item,
                selected: state.selected,
                disabled: state.disabled,
                select: state.select,
              })
            }
          </SelectableItem>
        );
      })}
    </SelectionProvider>
  );
}
