import React from 'react';
import { SectionList as NativeSectionList } from 'react-native';

import { withZoraThemeScope } from '../../../../theme/withZoraThemeScope';
import type { ManifestSectionListProps } from '../../../../types/manifest-list';
import { Text } from '../../../typography/public';
import { partitionListSections } from '../../application/use-cases/partitionListSections';
import { HorizontalListSeparator } from './HorizontalListSeparator';
import { useListVisibility } from './useListVisibility';
import { VerticalListSeparator } from './VerticalListSeparator';

/*** Virtualizes manifest children grouped by explicit section identities and child counts. */
export const SectionList = withZoraThemeScope(SectionListInner);

/*** Maps section identities and native scroll options to a virtualized section list. */
function SectionListInner({
  mode: _mode,
  themeId: _themeId,
  children,
  sections,
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
  stickySectionHeadersEnabled = true,
  interactionPolicy,
  testID,
}: ManifestSectionListProps) {
  const grouped = partitionListSections(React.Children.toArray(children), sections);
  const passive = interactionPolicy === 'passive';
  const onViewableItemsChanged = useListVisibility(onVisibleItemsChange, passive);
  return (
    <NativeSectionList
      sections={grouped}
      renderItem={({ item }) => <>{item}</>}
      keyExtractor={(item, index) =>
        React.isValidElement(item) && item.key !== null ? String(item.key) : String(index)
      }
      renderSectionHeader={({ section }) =>
        section.title ? <Text weight="semiBold">{section.title}</Text> : null
      }
      horizontal={horizontal}
      refreshing={refreshing}
      onRefresh={passive ? undefined : onRefresh}
      onEndReached={passive ? undefined : onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      stickySectionHeadersEnabled={!horizontal && stickySectionHeadersEnabled}
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
