import React from 'react';
import type { FlatList } from 'react-native';

import type { ManifestListProps } from '../../../../types/manifest-list';

type NativeViewToken = Parameters<
  NonNullable<React.ComponentProps<typeof FlatList>['onViewableItemsChanged']>
>[0]['viewableItems'][number];

/*** Keeps the native visibility callback stable and emits only serializable item identities. */
export function useListVisibility(
  onVisibleItemsChange: ManifestListProps['onVisibleItemsChange'],
  passive: boolean,
) {
  const handler = React.useRef(onVisibleItemsChange);
  const disabled = React.useRef(passive);
  React.useEffect(() => {
    handler.current = onVisibleItemsChange;
    disabled.current = passive;
  }, [onVisibleItemsChange, passive]);
  return React.useCallback(({ viewableItems }: { viewableItems: NativeViewToken[] }) => {
    if (!disabled.current)
      handler.current?.({
        keys: viewableItems
          .filter((item) => item.isViewable && typeof item.index === 'number' && item.index >= 0)
          .map((item) => item.key),
      });
  }, []);
}
