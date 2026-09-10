import React from 'react';
import { FlatList as NativeFlatList } from 'react-native';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ManifestListProps } from '../../../../types/manifest-list';
import { Text } from '../../../typography/public';
import { HorizontalListSeparator } from './HorizontalListSeparator';
import { useListVisibility } from './useListVisibility';
import { VerticalListSeparator } from './VerticalListSeparator';

/*** Virtualizes keyed manifest children using React Native FlatList and the Runtime repeat contract. */
export const FlatList = withZoraThemeScope(FlatListInner);

/*** Maps serializable list options to the native virtualized list. */
function FlatListInner({
  mode: _mode,
  themeId: _themeId,
  children,
  horizontal,
  refreshing = false,
  initialNumToRender,
  maxToRenderPerBatch,
  windowSize,
  onEndReachedThreshold,
  showsScrollIndicator = true,
  bounces,
  showSeparators,
  headerText,
  footerText,
  emptyText,
  onRefresh,
  onEndReached,
  onVisibleItemsChange,
  interactionPolicy,
  testID,
}: ManifestListProps) {
  const items = React.Children.toArray(children);
  const passive = interactionPolicy === 'passive';
  const onViewableItemsChanged = useListVisibility(onVisibleItemsChange, passive);
  return (
    <NativeFlatList
      data={items}
      renderItem={({ item }) => <>{item}</>}
      keyExtractor={(item, index) =>
        React.isValidElement(item) && item.key !== null ? String(item.key) : String(index)
      }
      horizontal={horizontal}
      refreshing={refreshing}
      onRefresh={passive ? undefined : onRefresh}
      onEndReached={passive ? undefined : onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      scrollEnabled={!passive}
      bounces={bounces}
      onViewableItemsChanged={onViewableItemsChanged}
      ItemSeparatorComponent={
        showSeparators ? (horizontal ? HorizontalListSeparator : VerticalListSeparator) : undefined
      }
      showsHorizontalScrollIndicator={showsScrollIndicator}
      showsVerticalScrollIndicator={showsScrollIndicator}
      ListHeaderComponent={headerText ? <Text>{headerText}</Text> : null}
      ListFooterComponent={footerText ? <Text>{footerText}</Text> : null}
      ListEmptyComponent={emptyText ? <Text>{emptyText}</Text> : null}
      testID={testID}
    />
  );
}
